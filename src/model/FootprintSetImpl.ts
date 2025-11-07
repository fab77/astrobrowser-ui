import { AstroEntity, AstroEntityInit } from "../types.js";
import { CatalogueGL, FootprintSetGL, MetadataManager } from "astroviewer";


export class FootprintSetImpl implements AstroEntity {
    private _id: string;
    private _name: string;
    private _description: string = "";
    private _providerUrl: string;
    private _metadataManager?: MetadataManager;
    private _astroviewerGlObj: CatalogueGL | FootprintSetGL | undefined;

    constructor(foootprintSetInit: AstroEntityInit) {
        if (!foootprintSetInit.id)  throw new Error(`No id defined for the foootprintSet.`)
        this._id = foootprintSetInit.id

        if (!foootprintSetInit.name)  throw new Error(`No name defined for the foootprintSet.`)
        this._name = foootprintSetInit.name

        if (!foootprintSetInit.providerUrl) throw new Error(`No provider URL defined for the foootprintSet ${this._name}.`)
        this._providerUrl = foootprintSetInit.providerUrl

        this._description = foootprintSetInit.description ?? ""
        
        if (!foootprintSetInit.metadataManager) throw new Error(`No MetadataManager defined for foootprintSet ${this._name}.`)
        this._metadataManager = foootprintSetInit.metadataManager
        this._astroviewerGlObj = new FootprintSetGL(
            this._name, this._description, 
            this._providerUrl, this._metadataManager)
    }
    
    // ----------- GETTERS -----------
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get providerUrl(): string {
        return this._providerUrl;
    }

    get metadataManager(): MetadataManager | undefined {
        return this._metadataManager;
    }

    get astroviewerGlObj(): CatalogueGL | FootprintSetGL | undefined {
        return this._astroviewerGlObj;
    }

    // ----------- SETTERS -----------
    set id(value: string) {
        this._id = value;
    }

    set name(value: string) {
        this._name = value;
    }

    set description(value: string) {
        this._description = value;
    }

    set providerUrl(value: string) {
        this._providerUrl = value;
    }

    set metadataManager(value: MetadataManager | undefined) {
        this._metadataManager = value;
    }

    set astroviewerGlObj(value: CatalogueGL | FootprintSetGL | undefined) {
        this._astroviewerGlObj = value;
    }
}