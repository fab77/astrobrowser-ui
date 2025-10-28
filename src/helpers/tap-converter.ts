import { CatalogueGL, FootprintSetGL, TapMetadata, TapMetadataList } from "astroviewer";
import { ADQLFunction, TapRepo } from "node_modules/astroviewer/lib-esm/model/tap/TapRepo"
import { Catalogue, DataProvider, DataProviderType, FootprintSet, FunctionDetails, Metadata, MetadataDetails } from "src/types"



async function hashString(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function convertADQLFunctionToDataProviderFunction(adqlFunction: ADQLFunction): FunctionDetails {
    if (typeof adqlFunction === 'string') {
        return { name: adqlFunction, signature: undefined, description: undefined }
    }
    return {
        name: adqlFunction.name,
        signature: adqlFunction.signature,
        description: adqlFunction.doc
    }
}


function convertTapMetadataToMetadata(tapMetadata: TapMetadata): Metadata {
    return {
        name: tapMetadata.name,
        description: tapMetadata.description,
        unit: tapMetadata.unit,
        dataType: tapMetadata.datatype,
        ucd: tapMetadata.ucd,
        uType: tapMetadata.uType,
        index: tapMetadata.index
    }
}

function convertTapMetadataListToMetadataList(tapMetadataList: TapMetadataList): MetadataDetails {

    const metadataList: Metadata[] = []
    for (const meta of tapMetadataList.metadataList) {
        metadataList.push(convertTapMetadataToMetadata(meta))
    }

    const posEqRAMetaColumns: Metadata[] = []
    for (const meta of tapMetadataList.posEqRAMetaColumns) {
        posEqRAMetaColumns.push(convertTapMetadataToMetadata(meta))
    }

    const posEqDecMetaColumns: Metadata[] = []
    for (const meta of tapMetadataList.posEqDecMetaColumns) {
        posEqDecMetaColumns.push(convertTapMetadataToMetadata(meta))
    }

    const sRegionMetaColumns: Metadata[] = []
    for (const meta of tapMetadataList.sRegionMetaColumns) {
        sRegionMetaColumns.push(convertTapMetadataToMetadata(meta))
    }

    const pgSphereMetaColumns: Metadata[] = []
    for (const meta of tapMetadataList.pgSphereMetaColumns) {
        pgSphereMetaColumns.push(convertTapMetadataToMetadata(meta))
    }

    return {
        metadataList: metadataList,
        posEqRAMetaColumns: posEqRAMetaColumns,
        posEqDecMetaColumns: posEqDecMetaColumns,
        sRegionMetaColumns: sRegionMetaColumns,
        pgSphereMetaColumns: pgSphereMetaColumns
    }
}


function generateUniqueId(datasetName: string, hashString: string) {
    return "[id_"+hashString+"_"+datasetName+"]"
}


function convertCatalogueGLtoCatalogue(catGL: CatalogueGL, hash: string): Catalogue {
    const metadataList = convertTapMetadataListToMetadataList(catGL.catalogueProps.tapMetadataList)
    return {
        id: generateUniqueId(catGL.name, hash),
        name: catGL.name,
        description: catGL.description,
        provider: catGL.tapRepo.tapBaseUrl,
        metadataDetails: metadataList,
        astroviewerGlObj: catGL
    }
}

function convertFootprintSetGLtoFootprintSet(footGL: FootprintSetGL, hash: string): FootprintSet {
    const metadataList = convertTapMetadataListToMetadataList(footGL.footprintsetProps.tapMetadataList)
    return {
        id: generateUniqueId(footGL.name, hash),
        name: footGL.name,
        description: footGL.description,
        provider: footGL.tapRepo.tapBaseUrl,
        metadataDetails: metadataList,
        astroviewerGlObj: footGL
    }
}

export async function convertTapRepoToDataProvider(tapRepo: TapRepo): Promise<DataProvider> {

    const dataproviderUrl = tapRepo.tapBaseUrl
    const type: DataProviderType = 'TAP'

    const hash = await hashString(dataproviderUrl)
    // preparing DataProvider.functions
    const dataProviderFunctions: FunctionDetails[] = []
    tapRepo.adqlFunctionList.forEach((adqlFunction: ADQLFunction) => {
        const convertedfunction = convertADQLFunctionToDataProviderFunction(adqlFunction)
        dataProviderFunctions.push(convertedfunction)
    })

    // preparing DataProvider.catalogues
    const dataPRoviderCatalogues: Catalogue[] = []
    tapRepo.cataloguesList.forEach((catGL: CatalogueGL) => {
        const catalogue = convertCatalogueGLtoCatalogue(catGL, hash)
        dataPRoviderCatalogues.push(catalogue)
    })

    // preparing DataProvider.footprints
    const dataPRoviderFootprints: FootprintSet[] = []
    tapRepo.observationsList.forEach((footGL: FootprintSetGL) => {
        const fSet = convertFootprintSetGLtoFootprintSet(footGL, hash)
        dataPRoviderFootprints.push(fSet)
    })

    return {
        url: dataproviderUrl,
        functions: dataProviderFunctions,
        type: type,
        catalogues: dataPRoviderCatalogues,
        footprints: dataPRoviderFootprints
    }
}


