export const hipsNodes: string[] = [
  "https://skies.esac.esa.int/",
  "https://alasky.cds.unistra.fr/",
];

// If you want to re-enable multiple TAP repos, just uncomment and extend the array
// export const tapRepos: string[] = [
//   "https://archive.eso.org/tap_cat/",
//   "https://archive.eso.org/tap_obs/",
//   "https://sky.esa.int/esasky-tap/tap/",
//   "https://ws.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/argus",
// ];

export const tapRepos: string[] = [
  "https://sky.esa.int/esasky-tap/tap/",
  "https://archive.eso.org/tap_cat/",
  "https://archive.eso.org/tap_obs/",
  "https://ws.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/argus",
  'https://alasky.cds.unistra.fr/TAPVizieR/tap',
  'https://gea.esac.esa.int/tap-server/tap'
];

export interface BootSetup {
  insideSphere: boolean;
  corsProxyUrl: string;
  useCORSProxy: boolean;
  defaultHipsUrl: string;
  version: string;
  debug: boolean
}

export const bootSetup: BootSetup = {
  insideSphere: false,
  corsProxyUrl: "http://localhost:4000/",
  useCORSProxy: false,
  defaultHipsUrl: "https://cdn.skies.esac.esa.int/DSSColor/",
  version: "Astrobrowser v1.0.0",
  debug: false
};