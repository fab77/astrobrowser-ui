import { AstroEntity, DataProvider, DataProviderType, FunctionDetails } from "../types";
import { CatalogueGL, FootprintSetGL, MetadataColumn, Point } from 'astroviewer'
import { parseCatalogueQueryResult, queryAsync } from "@services/repositories/tapRepoService";

const TAP_QUERY_TIMEOUT_MS = 60_000

export class TapRepo implements DataProvider {
    _type: DataProviderType = "TAP";
    _url: string;
    _functions: FunctionDetails[] = []
    _catalogues: AstroEntity[] = []
    _footprints: AstroEntity[] = []
    _notClassified: AstroEntity[] = []

    constructor(url: string) {
        this._url = url
    }

    get url(): string {
        return this._url
    }

    get type(): DataProviderType {
        return this._type
    }

    get functions(): FunctionDetails[] {
        return this._functions
    }
    get catalogues(): AstroEntity[] {
        return this._catalogues
    }
    get footprints(): AstroEntity[] {
        return this._footprints
    }
    get notClassified(): AstroEntity[] {
        return this._notClassified
    }

    set functions(functions: FunctionDetails[]) {
        this._functions = functions
    }

    set catalogues(catalogues: AstroEntity[]) {
        this._catalogues = catalogues
    }

    set footprints(footprints: AstroEntity[]) {
        this._footprints = footprints
    }

    set notClassified(notClassified: AstroEntity[]) {
        this._notClassified = notClassified
    }

    getQueryFoVPolygon(points: Point[]): string {
        return points.map(p => p.toADQL()).join(',');
    }

    private getColName(col: MetadataColumn | undefined): string {
        if (!col) return ''
        return (col.name ?? col.name ?? '').toString()
    }

    async queryCatalogueByFoV(
        catalogueGL: CatalogueGL,
        fovPolygon: Point[]
    ): Promise<CatalogueGL | undefined> {
        try {

            const polygonAdql = this.getQueryFoVPolygon(fovPolygon)
            // Resolve RA/Dec column names (CatalogueProps already picked them from metadata)
            const raCol = this.getColName(catalogueGL.metadataManager.selectedRaColumn)
            const decCol = this.getColName(catalogueGL.metadataManager.selectedDecColumn)
            const tapTable = catalogueGL.name

            if (!raCol || !decCol) {
                console.warn('[queryCatalogueByFoV] RA/Dec columns were not resolved from metadata.')
                return
            }

            const adql = `SELECT * FROM ${tapTable} WHERE 1 = CONTAINS(POINT('ICRS', ${raCol}, ${decCol}), POLYGON('ICRS',${polygonAdql}))`

            // Fire the TAP query
            const rows = await queryAsync(catalogueGL.providerUrl, adql, TAP_QUERY_TIMEOUT_MS)
            console.log(rows)

            if (rows && rows.data.length > 0) {
                const metadata = rows.metadata
                const data = rows.data

                console.log(`Found ${data.length} results for ${catalogueGL.name}`)
                const metadataColumns: MetadataColumn[] = parseCatalogueQueryResult(metadata)
                catalogueGL.addSources(data, metadataColumns)
                // catalogueGL = parseCatalogueQueryResult(catalogueGL, metadata, data)

                return catalogueGL
            } else {
                console.log('[queryCatalogueByFoV] No results found.')
                return
            }
        } catch (err: any) {
            console.error('[queryCatalogueByFoV] Error:', err?.message ?? err)
            return
        }
    }

    private prepareADQL(
        tapTable: string,
        tapRa: string | undefined,
        tapDec: string | undefined,
        fovPolygon: Point[],
        centralPoint: Point,
        radiusDeg: number): string {

        let adql = ""

        let polygonFunction = false
        this._functions.forEach(f => {
            if (f.name.includes('POLYGON')) {
                polygonFunction = true
                return
            }
        })

        if (polygonFunction) {
            const polygonAdql = this.getQueryFoVPolygon(fovPolygon)
            adql =
                'select * from ' +
                tapTable +
                ' where 1=CONTAINS(POINT(\'ICRS\',' +
                tapRa +
                ',' +
                tapDec +
                '), POLYGON(\'ICRS\', ' +
                polygonAdql +
                '))';
        } else {
            const radius = radiusDeg;
            adql =
                'select * from ' +
                tapTable +
                ' where 1=CONTAINS(POINT(\'ICRS\',' +
                tapRa +
                ',' +
                tapDec +
                '), CIRCLE(\'ICRS\', ' +
                centralPoint.raDeg +
                ', ' +
                centralPoint.decDeg +
                ', ' +
                radius +
                '))';
        }
        return adql
    }

    async queryFootprintSetByFov(
        footprintSetGL: FootprintSetGL,
        fovPolygon: Point[],
        centralPoint: Point,
        radiusDeg: number): Promise<FootprintSetGL | undefined> {

        try {

            // Resolve RA/Dec column names (CatalogueProps already picked them from metadata)
            const raCol = this.getColName(footprintSetGL.metadataManager.selectedRaColumn)
            const decCol = this.getColName(footprintSetGL.metadataManager.selectedDecColumn)
            const tapTable = footprintSetGL.name

            if (!raCol || !decCol) {
                console.warn('[queryFootprintSetByFov] RA/Dec columns were not resolved from metadata.')
                return
            }

            const adql = this.prepareADQL(tapTable, raCol, decCol, fovPolygon, centralPoint, radiusDeg)

            const rows = await queryAsync(footprintSetGL.providerUrl, adql, TAP_QUERY_TIMEOUT_MS)
            console.log(rows)
            // if (rows && rows.data.length > 0) {
            // const metadata = rows.metadata
            // const data = rows.data
            if (rows && rows.data.length > 0) {
                const metadata = rows.metadata
                const data = rows.data

                console.log(`Found ${data.length} results for ${footprintSetGL.name}`)
                const metadataColumns = parseCatalogueQueryResult(metadata)
                footprintSetGL.addFootprints(data, metadataColumns)
            } else {
                console.log('[queryFootprintSetByFov] No results found.')
                return
            }
        } catch (err: any) {
            console.error('[queryFootprintSetByFov] Error:', err?.message ?? err)
            return
        }
    }
}