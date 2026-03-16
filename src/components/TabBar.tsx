import type { ActiveTab } from "@/types/data";
import styles from "./TabBar.module.css";

interface Props {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: "dist",    label: "Distribution", icon: "▓" },
  { id: "scatter", label: "Scatterplot",  icon: "●" },
];

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <div className={styles.bar}>
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`${styles.tab} ${activeTab === t.id ? styles.active : ""}`}
          onClick={() => onChange(t.id)}
        >
          <span className={styles.icon}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
