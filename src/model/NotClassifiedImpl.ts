import { AstroEntity, AstroEntityInit } from "../types";
import { CatalogueGL, FootprintSetGL, MetadataManager } from "astroviewer";



export class NotClassifiedImpl implements AstroEntity {
    private _id: string;
    private _name: string;
    private _description: string = "";
    private _providerUrl: string;
    private _metadataManager?: MetadataManager = undefined
    private _astroviewerGlObj: CatalogueGL | FootprintSetGL | undefined = undefined

    constructor(init: AstroEntityInit) {
        this._id = init.id;
        this._name = init.name
        this._description = init.description ?? ""
        this._providerUrl = init.providerUrl
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