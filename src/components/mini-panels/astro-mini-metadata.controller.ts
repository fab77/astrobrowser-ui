import { ReactiveController, ReactiveControllerHost } from 'lit';
import { CATALOGUE_TYPE, FOOTPRINTSET_TYPE, type MiniMetadataPanel } from '../../types';
import { ColumnType, type MetadataColumn } from 'astroviewer';

export class AstroMiniMetadataController implements ReactiveController {
  private host: ReactiveControllerHost;
  model!: MiniMetadataPanel;

  // selections
  selectedRa?: string;
  selectedDec?: string;
  selectedShape?: string;
  selectedHue?: string;
  selectedOutline?: string;

  // cached lists
  raColumns: MetadataColumn[] = [];
  decColumns: MetadataColumn[] = [];
  shapeColumns: MetadataColumn[] = [];
  hueColumns: MetadataColumn[] = [];
  rows: MetadataColumn[] = [];
  detailKeys: string[] = [];
  datasetType: string = CATALOGUE_TYPE;

  constructor(host: ReactiveControllerHost, model: MiniMetadataPanel) {
    this.model = model;
    (this.host = host).addController(this);
    
  }

  hostConnected(): void {
    const gl = this.model.catOrFoot?.astroviewerGlObj;
    if (!gl) throw new Error(`No GL object for ${this.model.catOrFoot?.name}`);

    this.datasetType = this.model.datasetType;

    // read lists once (no logic in render)
    const mm = gl.metadataManager;
    this.raColumns    = mm.raColumnList ?? [];
    this.decColumns   = mm.decColumnList ?? [];
    this.shapeColumns = mm.shapeColumnList ?? [];
    this.hueColumns   = mm.hueColumnList ?? [];
    this.rows         = mm.columns ?? [];

    // selections from GL metadata (pre-populate)
    this.selectedRa      = mm.selectedRaColumn?.name;
    this.selectedDec     = mm.selectedDecColumn?.name;
    this.selectedShape   = mm.selectedShapeColumn?.name;
    this.selectedHue     = mm.selectedHueColumn?.name;
    this.selectedOutline = mm.selectedOutlineColumn?.name;

    // stable detail keys (same columns for each row)
    this.detailKeys = Array.from(new Set(
      this.rows.flatMap(r => r.details ? [...r.details.keys()] : [])
    ));

    this.host.requestUpdate();
  }

  get isCatalogue()  { return this.datasetType === CATALOGUE_TYPE; }
  get isFootprints() { return this.datasetType === FOOTPRINTSET_TYPE; }

  // Option builders (so render stays declarative)
  buildOptions(cols: MetadataColumn[], selected?: string, withDash = false) {
    const items = cols.map(c => ({ value: c.name, label: c.name, selected: c.name === selected }));
    if (withDash) items.unshift({ value: '-', label: '-', selected: !selected });
    return items;
  }

  // simple helpers
  isPosColumn(col: MetadataColumn): boolean {
    const t = col.columnType;
    return t === ColumnType.GEOM_DEC || t === ColumnType.GEOM_RA || t === ColumnType.GEOM_FOOTPRINT;
  }

  isIn(list: MetadataColumn[], r: MetadataColumn) {
    return list?.some(c => c.name === r.name);
  }
}