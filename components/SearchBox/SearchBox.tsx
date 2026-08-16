import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search notes"
      type="text"
      value={value}
    />
  );
}
