import {
  AcademicCapIcon,
  BeakerIcon,
  BoltIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CakeIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  CloudIcon,
  CodeBracketIcon,
  CogIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  FireIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TrophyIcon,
  UserGroupIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type HeroIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

export const EVENT_ICONS: Record<string, HeroIcon> = {
  AcademicCapIcon,
  BeakerIcon,
  BoltIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CakeIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  CloudIcon,
  CodeBracketIcon,
  CogIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  FireIcon,
  GlobeAltIcon,
  HeartIcon,
  HomeIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TrophyIcon,
  UserGroupIcon,
  WrenchIcon,
};

export function isEventIconName(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(EVENT_ICONS, name);
}

/**
 * Icons used to be stored as free text, so the DB may hold values outside
 * EVENT_ICONS. Those never rendered anywhere; treat them as "no icon" so
 * forms don't re-submit them and trip the server-side validation.
 */
export function normalizeEventIconName(
  name: string | null | undefined
): string {
  return name && isEventIconName(name) ? name : "";
}

/** "AcademicCapIcon" -> "Academic Cap" */
export function eventIconLabel(name: string): string {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}
