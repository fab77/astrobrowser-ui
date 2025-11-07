import { CatalogueGL, FootprintSetGL, MetadataManager } from "astroviewer";
import { AstroEntity, AstroEntityInit } from "../types";


export class CatalogueImpl implements AstroEntity {
    private _id: string;
    private _name: string;
    private _description: string = "";
    private _providerUrl: string;
    private _metadataManager?: MetadataManager;
    private _astroviewerGlObj: CatalogueGL | FootprintSetGL | undefined;

    constructor(catalogueInit: AstroEntityInit) {
        if (!catalogueInit.id)  throw new Error(`No id defined for the catalogue.`);
        this._id = catalogueInit.id;

        if (!catalogueInit.name)  throw new Error(`No name defined for the catalogue.`);
        this._name = catalogueInit.name;

        if (!catalogueInit.providerUrl)
            throw new Error(`No provider URL defined for the catalogue ${this._name}.`);
        this._providerUrl = catalogueInit.providerUrl;

        this._description = catalogueInit.description ?? "";
        
        if (!catalogueInit.metadataManager)
            throw new Error(`No CatalogueMetadataManager defined for catalogue ${this._name}.`);
        this._metadataManager = catalogueInit.metadataManager;

        this._astroviewerGlObj = new CatalogueGL(
            this._name,
            this._description,
            this._providerUrl,
            this._metadataManager
        );
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