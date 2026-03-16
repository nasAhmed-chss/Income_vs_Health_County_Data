import styles from "./RadioGroup.module.css";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
}

export default function RadioGroup({ options, value, onChange }: Props) {
  return (
    <div className={styles.stack}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`${styles.opt} ${value === opt.value ? styles.active : ""}`}
          onClick={() => onChange(opt.value)}
        >
          <span className={styles.dot} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
