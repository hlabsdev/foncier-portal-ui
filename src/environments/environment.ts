// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keyCloakUrl: "http://localhost:8181/auth",
  keyCloakRealm: "Portal",
  keyCloakClientId: "portal-ui",
  apiVersion: "v1/",
  apiUrl: "http://localhost:8282/api/",
  geoportalApp: "https://dev-sgf-gis01.az.sogema.local/portal/apps/webappviewer/index.html?id=65a2be22d50a4e968c53cfb8c42f9199",
  geoportalProApp: "https://dev-sgf-gis01.az.sogema.local/portal/apps/webappviewer/index.html?id=51e83348073e4b1e8622bcad9bf250be",
  gisOverviewApp: "https://dev-sgf-gis01.az.sogema.local/portal/apps/instant/interactivelegend/index.html?appid=21360b00703a4059b79f13e2f632f42b",
  apiUrlCamunda: "http://localhost:8282/engine-rest/"
}; //ts-ignor
