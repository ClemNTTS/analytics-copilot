import { getSemanticModel } from "./metadata";
import { getDbSchema } from "./pool_db";

export async function generateSQL(
  userQuestion: string,
  history: { role: string; content: string }[] = [],
): Promise<string> {
  const dbSchema = await getDbSchema();
  const mapping = await getSemanticModel();

  if (dbSchema === undefined || mapping === undefined) {
    throw new Error("Database connection failed");
  }

  const recentHistory = history
    .slice(-3)
    .map((entry) => `${entry.role === "user" ? "Client" : "Assistant"}: ${entry.content}`)
    .join("\n");

  return `
### ROLE
Tu es un expert PostgreSQL pour une plateforme SaaS de facturation. Ton but est de generer du SQL valide pour repondre a des besoins d'analyse.

### CONTEXTE DE LA CONVERSATION
${recentHistory || "Aucun historique precedent."}

### REGLES DE SECURITE
- Utilise uniquement des instructions SELECT.
- Ne fais jamais de DROP, DELETE, INSERT ou UPDATE.
- Si la question est totalement hors sujet, reponds exactement : SELECT 'OFF_TOPIC';
- Si la question est liee au business mais reste floue, genere la requete la plus utile possible a partir du schema.
- N'invente jamais de table ou de colonne absente du schema fourni.
- Il n'existe pas de table \`offer\` ou \`offers\` dans cette base.
- Pour analyser les types d'offre ou les plans, utilise \`billing_subscription.description\` comme libelle metier et \`billing_subscription.offer_id\` comme identifiant technique.
- Pour les analyses de MRR par offre, groupe prioritairement par \`billing_subscription.description\`.

### STRUCTURE TECHNIQUE
${dbSchema}

### MODELE SEMANTIQUE
${JSON.stringify(mapping, null, 2)}

### QUESTION
"${userQuestion}"

### REPONSE ATTENDUE
Renvoie uniquement le code SQL, sans commentaires, sans blocs markdown.
`;
}

export function generateAnswerPrompt(
  userQuestion: string,
  sqlQuery: string,
  jsonData: unknown,
  history: { role: string; content: string }[] = [],
): string {
  const recentHistory = history
    .slice(-3)
    .map((entry) => `${entry.role === "user" ? "Client" : "Assistant"}: ${entry.content}`)
    .join("\n");

  return `
### ROLE
Tu es un assistant analytique pour une plateforme SaaS. Reponds de maniere concise, naturelle et utile.

### HISTORIQUE RECENT
${recentHistory || "Debut de conversation."}

### CONTEXTE ACTUEL
- Question : "${userQuestion}"
- Requete SQL : "${sqlQuery}"
- Donnees JSON : ${JSON.stringify(jsonData, null, 2)}

### DIRECTIVES
- Utilise l'historique pour resoudre les references implicites.
- Sois concis et professionnel.
- Si les donnees sont vides, explique que tu n'as pas trouve de resultats.
- Reponds en francais.
`;
}
