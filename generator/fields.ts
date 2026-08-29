import {
  Briefcase,
  Dna,
  Drama,
  Fingerprint,
  Globe,
  Heart,
  Hourglass,
  MapPinned,
  ScrollText,
  Split,
  User,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { FieldId } from "./types";

export const FIELD_ICONS: Record<FieldId, LucideIcon> = {
  name: User,
  country: Globe,
  gender: UserRound,
  orientation: Heart,
  species: Dna,
  ageGroup: Hourglass,
  setting: MapPinned,
  occupation: Briefcase,
  archetype: Drama,
  marks: Fingerprint,
  traits: ScrollText,
  plotTwist: Split,
};
