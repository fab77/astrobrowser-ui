import { CatalogueGL, FootprintSetGL, MetadataManager } from "astroviewer";

export interface AstroEntity {
  id: string
  name: string;
  description?: string;
  providerUrl: string;
  metadataManager?: MetadataManager;
  astroviewerGlObj: CatalogueGL | FootprintSetGL | undefined
}

export interface AstroEntityInit {
  id: string;
  name: string;
  description?: string
  providerUrl: string;
  metadataManager?: MetadataManager;
}
