import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

export default function Filters({ children, className }) {
  return <ul className={className}>{children}</ul>;
}

function Searchbar({ iconClassName, inputClassName, ...props }) {
  return (
    <>
      <input
        id="search"
        name="search"
        type="search"
        className={inputClassName}
        {...props}
      />
      <BiSearchAlt className={iconClassName} />
    </>
  );
}

function FilterItem({ children, className }) {
  return <li className={className}>{children}</li>;
}

function FilterIcon({ Element, className }) {
  return <Element className={className} />;
}

function FilterOptions({ label, options, id, className, onChange, ...props }) {
  return (
    <>
      {label && <label htmlFor={id}>{id}</label>}
      <select
        name={id}
        id={id}
        className={`${className ?? ""} filter__select`}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <option className="filter__option" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

function FilterToggle({ children, className, handleClick, handleClear }) {
  const [toggleState, setToggleState] = useState(false);
  FilterToggle.toggleState = toggleState;
  FilterToggle.setToggleState = setToggleState;
  return (
    <button
      className={`${className} ${
        toggleState
          ? "bg-[var(--primary-linear-gradient)]"
          : "bg-none bg-(--alpha-bg-color) border-2"
      }`}
      onClick={() => {
        setToggleState((prev) => {
          if(prev)
            handleClear();
          else
            handleClick();
          return !prev;
        });
      }}
    >
      {children}
    </button>
  );
}

function FilterTitle({ children, className }) {
  return <span className={className}>{children}</span>;
}

Filters.Item = FilterItem;
Filters.Searchbar = Searchbar;
Filters.Icon = FilterIcon;
Filters.Options = FilterOptions;
Filters.Title = FilterTitle;
Filters.Toggle = FilterToggle;
