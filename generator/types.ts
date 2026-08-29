export const BODY_TYPES = ["humanoid", "anthro", "feral", "monster"] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export const FIELD_IDS = [
  "name",
  "country",
  "gender",
  "orientation",
  "species",
  "ageGroup",
  "occupation",
  "setting",
  "archetype",
  "marks",
  "traits",
  "plotTwist",
] as const;

export type FieldId = (typeof FIELD_IDS)[number];

export type FieldConfig = {
  enabled: boolean;
  locked: boolean;
};

export type FieldState = Record<FieldId, FieldConfig>;

export type Character = {
  id: string;
  createdAt: number;
  bodyType: BodyType;
  name?: string;
  country?: string;
  gender?: string;
  orientation?: string;
  species?: string;
  ageGroup?: string;
  occupationRole?: string;
  occupationTag?: string;
  setting?: string;
  archetype?: string;
  marks?: string[];
  traits?: string[];
  plotTwist?: string;
};

export type FieldGroup = {
  id: string;
  title: string;
  fields: FieldId[];
};
