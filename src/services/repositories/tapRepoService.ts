// import { TapRepo } from './TapRepo.js'

import { bootSetup } from '../../config'
// import { MetadataManager } from '../../../../astro-viewer/src/model/MetadataManager.js'
import { MetadataColumn, ColumnType, MetadataManager } from 'astroviewer'

import { CatalogueImpl } from '../../model/CatalogueImpl'
import { FootprintSetImpl } from '../../model/FootprintSetImpl'
import { NotClassifiedImpl } from '../../model/NotClassifiedImpl'
import { DataProvider, FunctionDetails } from '../../types'
import { TapRepo } from '../../model/TapRepo'


// let catId = 1
// let obsId = 1

export interface TapDatasets {
    obsList: FootprintSetImpl[]
    catalogueList: CatalogueImpl[]
    notClassifiedList: NotClassifiedImpl[]
}

/**
 * Initialize a TapRepo and populate capabilities + datasets.
 */
export async function addTAPRepo(repoUrl: string): Promise<DataProvider> {
    const tapRepo = new TapRepo(repoUrl)
    tapRepo.functions = await loadCapabilities(repoUrl)

    const datasets = await loadTables(repoUrl, tapRepo)

    tapRepo.catalogues = datasets.catalogueList
    tapRepo.footprints = datasets.obsList
    tapRepo.notClassified = datasets.notClassifiedList

    return tapRepo
}

export async function queryAsync(
    tapRepoUrl: string,
    adql: string,
    TAP_QUERY_TIMEOUT_MS: number
): Promise<any | null> {
    const base = bootSetup.corsProxyUrl.replace(/\/?$/, '/'); // ensure trailing /
    const url = new URL('adql', base);
    url.searchParams.set('tapurl', tapRepoUrl);
    url.searchParams.set('query', adql);

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TAP_QUERY_TIMEOUT_MS || 30000);

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'cors',
            signal: ac.signal,
            headers: { Accept: 'application/json' }
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`HTTP ${response.status} ${response.statusText} – ${text}`);
        }
        return await response.json(); // return type is 'any'
    } catch (err: any) {
        console.error('queryAsync error:', err?.message || err);
        return null;
    } finally {
        clearTimeout(t);
    }
}


/**
 * Fetch and parse tables from a TAP service.
 */
const loadTables = async (tapUrl: string, tapRepo: TapRepo): Promise<TapDatasets> => {
    const tablesUrl = `${tapUrl}/tables`
    const requestUrl = `${bootSetup.corsProxyUrl}exturl?url=${encodeURIComponent(tablesUrl)}`
    const result: TapDatasets = { obsList: [], catalogueList: [], notClassifiedList: [] }

    try {
        const response = await fetch(requestUrl, { method: 'GET', mode: 'cors' })
        const raw = await response.text()
        const data = raw.replace(/\n\t|\t|\n/g, '')

        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'application/xml')
        const root = doc.firstElementChild

        if (!root) throw new Error('Error parsing TAP XML. Missing root element.')
        if (!/tableset$/i.test(root.nodeName)) {
            throw new Error(`Error parsing TAP XML. ${root.nodeName} not recognised`)
        }

        const catalogueList: CatalogueImpl[] = []
        const obsList: FootprintSetImpl[] = []
        const notClassifiedList: NotClassifiedImpl[] = []

        // schemas
        for (const schema of Array.from(root.children)) {
            if (schema.nodeName !== 'schema') continue

            for (const table of Array.from(schema.children)) {
                if (table.nodeName !== 'table') continue

                const dataset: TableParseResult = parseTable(table as Element, tablesUrl, tapRepo)
                if (!dataset) continue

                if (dataset.catalogue) {
                    catalogueList.push(dataset.catalogue)
                }
                if (dataset.footprint) {
                    obsList.push(dataset.footprint)
                }
                if (dataset.notClassified) {
                    notClassifiedList.push(dataset.notClassified)
                }
            }
        }

        return { catalogueList, obsList, notClassifiedList }
    } catch (err: any) {
        console.error(err?.message ?? err)
        return result
    }
}

/**
 * Fetch and parse TAP capabilities to extract ADQL functions.
 */
const loadCapabilities = async (repoUrl: string): Promise<FunctionDetails[]> => {
    const capabilitiesUrl = `${repoUrl}/capabilities`
    const requestUrl = `${bootSetup.corsProxyUrl}exturl?url=${encodeURIComponent(capabilitiesUrl)}`
    let capabilities: FunctionDetails[] = []

    try {
        const response = await fetch(requestUrl, { method: 'GET', mode: 'cors' })
        const raw = await response.text()
        const data = raw.replace(/\n\t|\t|\n/g, '')

        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'application/xml')
        const root = doc.firstElementChild

        if (!root) throw new Error('Error parsing TAP XML. Missing root element.')
        if (!/capabilities$/i.test(root.nodeName)) {
            throw new Error(`Error parsing TAP XML. ${root.nodeName} not recognised`)
        }

        for (const capability of Array.from(root.children)) {
            if (capability.nodeName !== 'capability') continue

            for (const child of Array.from(capability.children)) {
                if (child.nodeName === 'language') {
                    capabilities = parseCapabilities(child as Element)
                }
            }
        }

        return capabilities
    } catch (err: any) {
        console.error(err?.message ?? err)
        return capabilities
    }
}

/**
 * Parse the <language> node to extract ADQL functions.
 */
const parseCapabilities = (languageNode: Element): FunctionDetails[] => {
    const out: FunctionDetails[] = []
    const featuresContainers = languageNode.getElementsByTagName('languageFeatures')
    if (!featuresContainers.length) return out

    const featureNodeList = featuresContainers[0].getElementsByTagName('feature')
    for (const feature of Array.from(featureNodeList)) {
        const formNode = feature.getElementsByTagName('form')[0]
        if (formNode?.textContent) out.push({ name: formNode.textContent })
    }
    return out
}

// type TableParseResult = {
//     catalogue: CatalogueGL | null
//     footprint: FootprintSetGL | null
//     notClassified: string | null
// }
type TableParseResult = {
    catalogue: CatalogueImpl | null
    footprint: FootprintSetImpl | null
    notClassified: NotClassifiedImpl | null
}

/**
 * Parse a <table> node and build dataset wrappers.
 */
const parseTable = (tableNode: Element, tablesUrl: string, tapRepo: TapRepo): TableParseResult => {
    const nameNode = tableNode.getElementsByTagName('name')[0]
    if (!nameNode?.textContent) {
        return { catalogue: null, footprint: null, notClassified: null }
    }

    const tableName = nameNode.textContent
    const tableDesc = tableNode.getElementsByTagName('description')[0]?.textContent ?? null

    const metaColumns = tableNode.getElementsByTagName('column')


    //   const tapMetas = new TapMetadataList()

    let idx = 0
    let metadataColumns = []
    let mainNameColumn = undefined

    let isCatalgue = false
    let isRA = false
    let isDec = false
    let isFootprintSet = false

    for (const col of Array.from(metaColumns)) {
        const name = col.getElementsByTagName('name')[0]?.textContent ?? ''
        const description = col.getElementsByTagName('description')[0]?.textContent ?? ""
        const unit = col.getElementsByTagName('unit')[0]?.textContent ?? ""
        const dataType = col.getElementsByTagName('dataType')[0]?.textContent ?? ""
        const ucd = col.getElementsByTagName('ucd')[0]?.textContent ?? ""
        const utype = col.getElementsByTagName('utype')[0]?.textContent ?? ""


        let columnType = ColumnType.STRING
        if (ucd == "pos.eq.ra;meta.main") {
            columnType = ColumnType.GEOM_RA
            isRA = true
        }
        if (ucd == "pos.eq.dec;meta.main") {
            columnType = ColumnType.GEOM_DEC
            isDec = true
        }
        if (ucd.includes("pos.outline;obs.field")  || ucd.includes('pos.outline;meta.pgsphere') || 
            utype.includes('Char.SpatialAxis.Coverage.Support.Area') ||
            dataType.includes('adql:REGION') || name == 'stc_s') {
            columnType = ColumnType.GEOM_FOOTPRINT
            isFootprintSet = true
        }
        if (ucd.includes('meta.id') && ucd.includes('meta.main')) {
            columnType = ColumnType.MAIN_NAME
        }
        if (columnType == ColumnType.STRING && ["short", "int", "long", "float", "double"].includes(dataType)) {
            columnType = ColumnType.NUMBER
        }

        let columnsMap = new Map<string, string | number>()
        columnsMap.set("name", name)
        columnsMap.set("dataType", dataType)
        columnsMap.set("description", description)
        columnsMap.set("ucd", ucd)
        columnsMap.set("utype", utype)
        columnsMap.set("unit", unit)

        const column = new MetadataColumn({
            index: idx,
            name: name,
            description: description,
            columnType: columnType,
            unit: unit,
            details: columnsMap
        })
        metadataColumns.push(column)


        // const tapMeta = new TapMetadata(name, description, unit, dataType, ucd, utype)
        // tapMetas.addMetadata(tapMeta)
        idx++
    }

    const mtManager = new MetadataManager(metadataColumns)


    isCatalgue = isRA && isDec

    // let catalogue: CatalogueGL | null = null
    // let footprint: FootprintSetGL | null = null
    // let notClassified: string | null = null

    //todo create interface to be implemented below
    let catalogue: CatalogueImpl | null = null
    let fset: FootprintSetImpl | null = null
    let nc: NotClassifiedImpl | null = null

    const id = `id_${tableName}_${tapRepo.url}`

    if (isCatalgue) {
        catalogue = new CatalogueImpl({
            id: id,
            name: tableName,
            description: tableDesc,
            providerUrl: tapRepo.url,
            metadataManager: mtManager
        })
    }
    if (isFootprintSet) {

        fset = new FootprintSetImpl({
            id: id,
            name: tableName,
            description: `NC entity for ${tablesUrl}#${tableName}`,
            providerUrl: tapRepo.url,
            metadataManager: mtManager,
        })
    }

    if (!isCatalgue && !isFootprintSet) {
        nc = new NotClassifiedImpl({
            id: id,
            name: tableName,
            description: `NC entity for ${tablesUrl}#${tableName}`,
            providerUrl: tapRepo.url,
            metadataManager: undefined,
        })
    }

    return { catalogue: catalogue, footprint: fset, notClassified: nc }
    // if (tapMetas.pgSphereMetaColumns.length > 0 || tapMetas.sRegionMetaColumns.length > 0) {
    //     footprint = new FootprintSetGL(tableName, tableDesc, tapRepo, tapMetas)
    // } else if (tapMetas.posEqRAMetaColumns.length > 0 && tapMetas.posEqDecMetaColumns.length > 0) {
    //     catalogue = new CatalogueGL(tableName, tableDesc, tapRepo, tapMetas)
    // } else {
    //     notClassified = `TODO: create NC entity for ${tablesUrl}#${tableName}`
    // }

    // return { catalogue, footprint, notClassified }
}

export const parseCatalogueQueryResult = (metadata: any): MetadataColumn[] => {
    let idx = 0
    let metadataColumns: MetadataColumn[] = []
    for (const element of metadata) {
        const name = element.name
        const description = element.description ?? ""
        const unit = element.unit ?? ""
        const dataType = element.datatype ?? ""
        const ucd = element.ucd ?? ""
        const utype = element.utype ?? ""

        let columnType = ColumnType.STRING
        if (ucd == "pos.eq.ra;meta.main") {
            columnType = ColumnType.GEOM_RA
        } else if (ucd == "pos.eq.dec;meta.main") {
            columnType = ColumnType.GEOM_DEC
        } else if (ucd.includes('meta.id') && ucd.includes('meta.main')) {
            columnType = ColumnType.MAIN_NAME
        } else if (ucd.includes("pos.outline;obs.field")  || ucd.includes('pos.outline;meta.pgsphere') || 
            utype.includes('Char.SpatialAxis.Coverage.Support.Area') ||
            dataType.includes('adql:REGION') || name == 'stc_s') {
            columnType = ColumnType.GEOM_FOOTPRINT
        } else if (["short", "int", "long", "float", "double"].includes(dataType)) {
            columnType = ColumnType.NUMBER
        } 

        let columnsMap = new Map<string, string | number>()
        // columnsMap.set("name", name)
        columnsMap.set("dataType", dataType)
        // columnsMap.set("description", description)
        columnsMap.set("ucd", ucd)
        columnsMap.set("utype", utype)
        // columnsMap.set("unit", unit)

        const column = new MetadataColumn({
            index: idx,
            name: name,
            description: description,
            columnType: columnType,
            unit: unit,
            details: columnsMap
        })
        metadataColumns.push(column)
        idx++
    }
    return metadataColumns
    // catalogueGL.addSources(data, metadataColumns)
    // return catalogueGL

}