const params = new URLSearchParams(window.location.search);
console.table(Object.fromEntries(params));

/*
ATTAQUANT
A_A     Nombre d'attaques
A_WS    Capacité de combat
A_S     Force
A_AP    Pénétration d'armure
A_D     Dégats
DEFENSEUR
D_T	   Endurance
D_S	   Sauvegarde
D_SI   Sauvegarde d'invulnerable
D_W	   Points de vie
D_FNP  Feel No Pain

*/
function cogitate(params) {
  // Récupération des paramètres
  // Attaquant
  const A_A = parseInt(params.get("A_A"));
  const A_WS = parseInt(params.get("A_WS"));
  const A_S = parseInt(params.get("A_S"));
  const A_AP = parseInt(params.get("A_AP"));
  const A_D_DM = parseInt(params.get("A_D_DM"));
  const A_D_D = parseInt(params.get("A_D_D"));
  const A_D_FB = parseInt(params.get("A_D_FB"));
  // Défenseur
  const D_T = parseInt(params.get("D_T"));
  const D_S = parseInt(params.get("D_S"));
  const D_SI = parseInt(params.get("D_SI"));
  const D_W = parseInt(params.get("D_W"));
  const D_FNP = parseInt(params.get("D_FNP"));
  /*
    A_A d6
    parmi ces A_A attaques, combien de réussites ? (A_WS)
    parmi ces réussites, combien de blessures ? (A_S vs D_T)
    parmi ces blessures, combien de blessures qui passent la sauvegarde ? (A_AP vs D_S)
    parmi ces blessures qui passent la sauvegarde, combien de blessures qui passent la sauvegarde d'invulnerable ? (A_AP vs D_SI)
    si invulnerable, prendre la meilleure sauvegarde entre la sauvegarde normale et la sauvegarde d'invulnerable en fonction de A_AP vs D_S et D_SI
    parmi ces blessures qui passent la sauvegarde d'invulnerable, combien de blessures qui font des dégâts ? (A_D_DM, A_D_D, A_D_FB)
    parmi ces blessures qui font des dégâts, combien de blessures qui tuent le défenseur ? (D_W)
    parmi ces blessures qui tuent le défenseur, combien de blessures que le défenseur ignore grâce à son Feel No Pain ? (D_FNP)
    */
  const expectedHits = (A_A * (7 - A_WS)) / 6;
  const expectedWounds = (expectedHits * (7 - Math.max(A_S - D_T, 2))) / 6;
  const expectedSaves = (expectedWounds * (7 - Math.max(A_AP - D_S, 2))) / 6;
  const expectedInvulnerableSaves =
    (expectedWounds * (7 - Math.max(A_AP - D_SI, 2))) / 6;
  const expectedBestSaves = Math.max(expectedSaves, expectedInvulnerableSaves);
  const expectedDamage = expectedBestSaves * (A_D_DM + A_D_D + A_D_FB);
  const expectedFeelNoPain = (expectedDamage * D_FNP) / 6;
  const finalExpectedDamage = expectedDamage - expectedFeelNoPain;

  console.log("Expected Hits:", expectedHits);
  console.log("Expected Wounds:", expectedWounds);
  console.log("Expected Saves:", expectedSaves);
  console.log("Expected Invulnerable Saves:", expectedInvulnerableSaves);
  console.log("Expected Best Saves:", expectedBestSaves);
  console.log("Expected Damage:", expectedDamage);
  console.log("Expected Feel No Pain:", expectedFeelNoPain);
  console.log("Final Expected Damage:", finalExpectedDamage);
}

cogitate(params);
