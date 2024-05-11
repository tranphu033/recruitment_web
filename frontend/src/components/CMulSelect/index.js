import "./style.css";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const CustomToggle = React.forwardRef(
  ({ children, className, onClick }, ref) => (
    <div
      ref={ref}
      className={clsx("form-select", className)}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </div>
  )
);
const convert2SelectOptions = (items, textAtt, valueAtt) => {
  let temp = [];
  items?.forEach((item, index) => {
    temp.push({
      id: index,
      text: item[textAtt],
      value: item[valueAtt],
      select: false,
    });
  });

  return temp;
};
export default function CMulSelect({
  className,
  items,
  textAtt,
  valueAtt,
  defaultText,
  setOutput,
  contentWidth,
  size,
  defaultValue = [],
}) {
  const [options, setOptions] = useState(
    convert2SelectOptions(items, textAtt, valueAtt)
  );
  const [curOptions, setCurOptions] = useState([]);

  const handleSelect = (option, index) => {
    let tempOptions = [...options];
    let tempCurOptions = [...curOptions];

    // update options:
    tempOptions[index].select = !tempOptions[index].select;
    setOptions(tempOptions);
    // update curOptions:
    let ind = tempCurOptions.findIndex((item) => item.id === option.id);
    if (ind < 0) {
      tempCurOptions.push(option);
    } else {
      tempCurOptions.splice(ind, 1);
    }
    setCurOptions(tempCurOptions);
    // update output:
    let tempOutput = tempCurOptions.map((item) => item.value);
    setOutput(tempOutput);
  };

  useEffect(() => {
    if (defaultValue.length > 0) {
      setOutput(defaultValue);
      const tempOptions = [...options];
      const tempCurOptions = [];
      options.forEach((item, index) => {
        if (defaultValue.includes(item.value)) {
          tempOptions[index].select = true;
          tempCurOptions.push({
            id: item.id,
            text: item.text,
            value: item.value,
          });
        }
      });
      setOptions(tempOptions);
      setCurOptions(tempCurOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dropdown className={className}>
      <Dropdown.Toggle
        as={CustomToggle}
        className={clsx(
          "trigger text-truncate pointer",
          size === "sm" && "form-select-sm"
        )}
      >
        {curOptions.length > 0
          ? curOptions.map((item, index) => (
              <span key={item.id}>
                {item.text}
                {index < curOptions.length - 1 && ", "}
              </span>
            ))
          : defaultText}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className={clsx("py-0 w-100 overflow-auto", size === "sm" && "ts-sm")}
        style={{ maxHeight: "438px", minWidth: contentWidth || "" }}
      >
        {options?.map((option, index) => (
          <div
            key={`option_${index}`}
            className={clsx(
              "d-flex align-items-center ps-2 pointer",
              option.select
                ? "text-primary"
                : "hover-bg-primary hover-text-white"
            )}
            onClick={() => handleSelect(option, index)}
          >
            {option.select ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            <span className="ms-1">{option.text}</span>
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
