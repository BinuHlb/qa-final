/**
 * Shared Component Library
 * Reusable component configurations and factory functions
 */

import { ReactNode } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Eye, 
  X, 
  Pause,
  Shield,
  UserCheck,
  Building2,
  FileText,
  Users,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Bookmark,
  Share,
  Copy,
  RefreshCw,
  Loader2,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Hash,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Sparkles,
  Crown,
  Award,
  Trophy,
  Medal,
  Gift,
  Bell,
  MessageSquare,
  Send,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
  Headphones,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause as PauseIcon,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  List,
  Layout,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  Leaf,
  Flower2,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Scooter,
  Skateboard,
  Gamepad2,
  Joystick,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Chess,
  Puzzle,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Scissors,
  Wrench,
  Hammer,
  Screwdriver,
  Cog,
  Settings2,
  Sliders,
  Toggle,
  ToggleLeft,
  ToggleRight,
  Switch,
  Radio,
  Checkbox,
  Check,
  Minus,
  Plus as PlusIcon,
  Divide,
  Multiply,
  Equal,
  NotEqual,
  LessThan,
  GreaterThan,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftUp,
  CornerLeftDown,
  CornerRightUp,
  CornerRightDown,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateLeft,
  RotateRight,
  FlipHorizontal,
  FlipVertical,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  ListUnordered,
  Indent,
  Outdent,
  Quote,
  Code,
  Terminal,
  Database,
  Server,
  HardDrive,
  MemoryStick,
  Cpu,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  HeadphonesIcon,
  Speaker,
  MicIcon,
  VideoIcon,
  CameraIcon,
  ImageIcon,
  FileIcon,
  FolderIcon,
  ArchiveIcon,
  Inbox,
  Outbox,
  SendIcon,
  Reply,
  ReplyAll,
  Forward,
  ShareIcon,
  CopyIcon,
  Cut,
  Paste,
  Undo,
  Redo,
  Save,
  SaveAll,
  Open,
  New,
  Print,
  Scan,
  Fax,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Signal,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryHigh,
  BatteryFull,
  Power,
  PowerOff,
  Lightbulb,
  LightbulbOff,
  Flashlight,
  FlashlightOff,
  Candle,
  FlameIcon,
  Fire,
  ZapIcon,
  Bolt,
  Thunderbolt,
  Lightning,
  Energy,
  Atom,
  Globe,
  Earth,
  Map,
  Compass,
  Navigation,
  Route,
  Flag,
  FlagTriangleLeft,
  FlagTriangleRight,
  Home,
  Building,
  Store,
  Bank,
  Hospital,
  School,
  Church,
  Mosque,
  Temple,
  Cemetery,
  Park,
  Forest,
  Mountain,
  Volcano,
  Island,
  Beach,
  Desert,
  Oasis,
  Lake,
  River,
  Ocean,
  Sea,
  Wave,
  Tsunami,
  Tornado,
  Hurricane,
  Cyclone,
  Rainbow,
  StarIcon,
  Constellation,
  Galaxy,
  Planet,
  Satellite,
  Rocket,
  Space,
  Universe,
  Cosmos,
  Infinity,
  Pi,
  Sigma,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega,
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X as XIcon,
  Y,
  Z,
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Hundred,
  Thousand,
  Million,
  Billion,
  Trillion,
  Infinity as InfinityIcon,
} from 'lucide-react';

// ============================================================================
// ICON MAPPING
// ============================================================================

export const ICON_MAP = {
  // Status Icons
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Eye,
  X: XIcon,
  Pause: PauseIcon,
  
  // Role Icons
  Shield,
  UserCheck,
  Building2,
  FileText,
  Users,
  Settings,
  
  // Action Icons
  Search,
  Filter,
  Plus: PlusIcon,
  Edit,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  
  // Feature Icons
  Star,
  Heart,
  Bookmark,
  Share,
  Copy,
  RefreshCw,
  Loader2,
  Info,
  HelpCircle,
  
  // Security Icons
  Lock,
  Unlock,
  Key,
  
  // Contact Icons
  Mail,
  Phone,
  MapPin,
  Calendar,
  
  // Data Icons
  Tag,
  Hash,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  
  // Special Icons
  Zap,
  Sparkles,
  Crown,
  Award,
  Trophy,
  Medal,
  Gift,
  Bell,
  MessageSquare,
  Send,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
  Headphones,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  List,
  Layout,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  Leaf,
  Flower2,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Scooter,
  Skateboard,
  Gamepad2,
  Joystick,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Chess,
  Puzzle,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Scissors,
  Wrench,
  Hammer,
  Screwdriver,
  Cog,
  Settings2,
  Sliders,
  Toggle,
  ToggleLeft,
  ToggleRight,
  Switch,
  Radio,
  Checkbox,
  Check,
  Minus,
  Divide,
  Multiply,
  Equal,
  NotEqual,
  LessThan,
  GreaterThan,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftUp,
  CornerLeftDown,
  CornerRightUp,
  CornerRightDown,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateLeft,
  RotateRight,
  FlipHorizontal,
  FlipVertical,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  ListUnordered,
  Indent,
  Outdent,
  Quote,
  Code,
  Terminal,
  Database,
  Server,
  HardDrive,
  MemoryStick,
  Cpu,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  HeadphonesIcon,
  Speaker,
  MicIcon,
  VideoIcon,
  CameraIcon,
  ImageIcon,
  FileIcon,
  FolderIcon,
  ArchiveIcon,
  Inbox,
  Outbox,
  SendIcon,
  Reply,
  ReplyAll,
  Forward,
  ShareIcon,
  CopyIcon,
  Cut,
  Paste,
  Undo,
  Redo,
  Save,
  SaveAll,
  Open,
  New,
  Print,
  Scan,
  Fax,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Signal,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryHigh,
  BatteryFull,
  Power,
  PowerOff,
  Lightbulb,
  LightbulbOff,
  Flashlight,
  FlashlightOff,
  Candle,
  FlameIcon,
  Fire,
  ZapIcon,
  Bolt,
  Thunderbolt,
  Lightning,
  Energy,
  Atom,
  Globe,
  Earth,
  Map,
  Compass,
  Navigation,
  Route,
  Flag,
  FlagTriangleLeft,
  FlagTriangleRight,
  Home,
  Building,
  Store,
  Bank,
  Hospital,
  School,
  Church,
  Mosque,
  Temple,
  Cemetery,
  Park,
  Forest,
  Mountain,
  Volcano,
  Island,
  Beach,
  Desert,
  Oasis,
  Lake,
  River,
  Ocean,
  Sea,
  Wave,
  Tsunami,
  Tornado,
  Hurricane,
  Cyclone,
  Rainbow,
  StarIcon,
  Constellation,
  Galaxy,
  Planet,
  Satellite,
  Rocket,
  Space,
  Universe,
  Cosmos,
  Infinity,
  Pi,
  Sigma,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega,
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X: XIcon,
  Y,
  Z,
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Hundred,
  Thousand,
  Million,
  Billion,
  Trillion,
  Infinity: InfinityIcon,
} as const;

// ============================================================================
// COMPONENT FACTORY FUNCTIONS
// ============================================================================

export interface ComponentConfig {
  type: string;
  variant?: string;
  size?: string;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export interface ButtonConfig extends ComponentConfig {
  type: 'button';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
  icon?: keyof typeof ICON_MAP;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export interface CardConfig extends ComponentConfig {
  type: 'card';
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'default' | 'lg';
  header?: {
    title?: string;
    description?: string;
    badge?: {
      text: string;
      variant?: string;
    };
  };
  footer?: ReactNode;
  children: ReactNode;
}

export interface BadgeConfig extends ComponentConfig {
  type: 'badge';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  icon?: keyof typeof ICON_MAP;
  children: ReactNode;
}

export interface StatusBadgeConfig extends BadgeConfig {
  status: string;
  statusType: 'qaReview' | 'file' | 'user';
}

// ============================================================================
// STATUS BADGE FACTORY
// ============================================================================

export function createStatusBadgeConfig(
  status: string, 
  statusType: 'qaReview' | 'file' | 'user'
): StatusBadgeConfig {
  const statusConfig = {
    qaReview: {
      'Not Started': { variant: 'warning', icon: 'Clock' },
      'In Progress': { variant: 'info', icon: 'AlertCircle' },
      'Completed': { variant: 'success', icon: 'CheckCircle' },
      'Overdue': { variant: 'destructive', icon: 'AlertTriangle' },
    },
    file: {
      'uploaded': { variant: 'warning', icon: 'Clock' },
      'under_review': { variant: 'info', icon: 'Eye' },
      'approved': { variant: 'success', icon: 'CheckCircle' },
      'rejected': { variant: 'destructive', icon: 'X' },
    },
    user: {
      'active': { variant: 'success', icon: 'CheckCircle' },
      'inactive': { variant: 'warning', icon: 'Pause' },
      'pending': { variant: 'info', icon: 'Clock' },
    },
  };

  const config = statusConfig[statusType][status] || { variant: 'secondary', icon: 'Info' };

  return {
    type: 'badge',
    status,
    statusType,
    variant: config.variant as any,
    icon: config.icon,
    children: status,
  };
}

// ============================================================================
// QUICK ACTION FACTORY
// ============================================================================

export interface QuickActionConfig extends ComponentConfig {
  type: 'quickAction';
  title: string;
  description: string;
  icon: keyof typeof ICON_MAP;
  variant?: 'default' | 'glass' | 'elevated';
  href?: string;
  onClick?: () => void;
  badge?: {
    text: string;
    variant?: string;
  };
}

export function createQuickActionConfig(
  title: string,
  description: string,
  icon: keyof typeof ICON_MAP,
  options: Partial<QuickActionConfig> = {}
): QuickActionConfig {
  return {
    type: 'quickAction',
    title,
    description,
    icon,
    variant: 'default',
    ...options,
  };
}

// ============================================================================
// STAT CARD FACTORY
// ============================================================================

export interface StatCardConfig extends ComponentConfig {
  type: 'statCard';
  title: string;
  value: string | number;
  description?: string;
  icon: keyof typeof ICON_MAP;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'glass' | 'elevated';
}

export function createStatCardConfig(
  title: string,
  value: string | number,
  icon: keyof typeof ICON_MAP,
  options: Partial<StatCardConfig> = {}
): StatCardConfig {
  return {
    type: 'statCard',
    title,
    value,
    icon,
    variant: 'default',
    ...options,
  };
}

// ============================================================================
// NAVIGATION ITEM FACTORY
// ============================================================================

export interface NavigationItemConfig extends ComponentConfig {
  type: 'navigationItem';
  name: string;
  href: string;
  icon: keyof typeof ICON_MAP;
  badge?: {
    text: string;
    variant?: string;
  };
  active?: boolean;
  disabled?: boolean;
}

export function createNavigationItemConfig(
  name: string,
  href: string,
  icon: keyof typeof ICON_MAP,
  options: Partial<NavigationItemConfig> = {}
): NavigationItemConfig {
  return {
    type: 'navigationItem',
    name,
    href,
    icon,
    active: false,
    disabled: false,
    ...options,
  };
}

// ============================================================================
// TABLE COLUMN FACTORY
// ============================================================================

export interface TableColumnConfig extends ComponentConfig {
  type: 'tableColumn';
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => ReactNode;
  cellType?: 'text' | 'badge' | 'avatar' | 'date' | 'number' | 'boolean' | 'custom';
}

export function createTableColumnConfig(
  key: string,
  header: string,
  options: Partial<TableColumnConfig> = {}
): TableColumnConfig {
  return {
    type: 'tableColumn',
    key,
    header,
    sortable: false,
    filterable: false,
    align: 'left',
    cellType: 'text',
    ...options,
  };
}

// ============================================================================
// FORM FIELD FACTORY
// ============================================================================

export interface FormFieldConfig extends ComponentConfig {
  type: 'formField';
  name: string;
  label: string;
  fieldType: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: string }>;
  icon?: keyof typeof ICON_MAP;
  description?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export function createFormFieldConfig(
  name: string,
  label: string,
  fieldType: FormFieldConfig['fieldType'],
  options: Partial<FormFieldConfig> = {}
): FormFieldConfig {
  return {
    type: 'formField',
    name,
    label,
    fieldType,
    required: false,
    disabled: false,
    ...options,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getIconComponent(iconName: keyof typeof ICON_MAP) {
  return ICON_MAP[iconName] || ICON_MAP.Info;
}

export function createComponentId(type: string, name: string): string {
  return `${type}-${name.toLowerCase().replace(/\s+/g, '-')}`;
}

export function mergeConfigs<T extends ComponentConfig>(base: T, overrides: Partial<T>): T {
  return { ...base, ...overrides };
}
