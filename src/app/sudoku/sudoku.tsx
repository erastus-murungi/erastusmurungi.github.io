"use client";

import React from "react";
import styled from "@emotion/styled";
import { lora, satisfy } from "@/styles/fonts";
import { type Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { getSudoku } from "sudoku-gen";

type Maybe<T> = T | null | undefined;

export function getBoard(difficulty: Difficulty) {
  const sudoku = getSudoku(difficulty);
  const values = sudoku.puzzle.split("").map((value, index) => ({
    value: value === "-" ? null : parseInt(value, 10),
    hasError: false,
    isOriginal: value !== "-",
    answer: parseInt(sudoku.solution[index], 10),
    isSelectedBoardIndex: false,
    isHighlighted: false,
    smaller: false,
  }));
  return {
    values,
    board: Array.from({ length: 9 }, (_, i) => values.slice(i * 9, i * 9 + 9)),
  };
}

export const NotesStyledDiv = styled.div`
  display: flex;
  align-items: top left;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
`;

export const NotesValue = styled.span<{ isOriginal: boolean }>`
  transition: all 0.5s;
  font-family: "Titillium Web", sans-serif;
  font-weight: bold;
  font-size: 15px;
  color: ${({ isOriginal, theme }) => (isOriginal ? "#blue" : "#black")};
`;

export interface NotesProps {
  values: number[];
  isOriginal: boolean;
}

const NotesWrapper: React.FC<NotesProps> = ({ values, isOriginal }) => (
  <NotesStyledDiv>
    {values.map((val) => (
      <NotesValue isOriginal key={`note_${val}`}>
        {val}
      </NotesValue>
    ))}
  </NotesStyledDiv>
);

export interface Value {
  value: number | null;
  hasError: boolean;
  isOriginal: boolean;
  isHighlighted: boolean;
  isSelectedBoardIndex: boolean;
  smaller: boolean;
  answer: number;
}

export const ValueMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const ValueContent = styled.div<{
  isOriginal: boolean;
  hasError: boolean;
}>`
  transition: all 0.5s;
  width: 100%;
  height: 100%;
  display: flex;
  color: ${({ isOriginal, theme, hasError }) =>
    isOriginal ? "blue" : hasError ? "red" : "black"};
  font-weight: bold;
`;

const ValueWrapper: React.FC<Value> = ({ value, ...otherProps }) => (
  <ValueMain>
    <ValueContent
      className={`${lora.className} items-center justify-center text-2xl`}
      {...otherProps}
    >
      {value}
    </ValueContent>
  </ValueMain>
);

export interface SudokuSquareProps {
  selectedIndex: Maybe<number>;
  selectedRowIndex: Maybe<number>;
  selectedBoardIndex: Maybe<number>;
  rowIndex: number;
  boardIndex: number;
  index: number;
  value: Value;
  setValue: (boardIndex: number, value: Value) => void;
  initialValue: Value;
  setSelectedBoardIndices: (values: {
    selectedBoardIndex: number;
    selectedIndex: number;
    selectedRowIndex: number;
  }) => void;
  answer: number;
  hide: boolean;
  notes: number[];
  hasError: boolean;
}

const OuterContainer = styled.div<{
  isThickRight: boolean;
  isSelected: boolean;
  isThickBottom: boolean;
  isLastColumn: boolean;
  isLastRow: boolean;
  isSelectedBoardIndex: boolean;
}>(
  ({
    isThickRight,
    isLastColumn,
    isThickBottom,
    isLastRow,
    isSelected,
    isSelectedBoardIndex,
  }) => ({
    position: "relative",
    width: "50px",
    height: "50px",
    borderRight: isThickRight
      ? `solid 4px #000`
      : isLastColumn
      ? ""
      : "solid 1px #000",
    borderBottom: isThickBottom
      ? `solid 4px #000`
      : isLastRow
      ? ""
      : "solid 1px #000",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(28, 28, 28, 0.3)",
    },
    "&:after": {
      content: '""',
      position: "absolute",
      width: "50px",
      height: "50px",
      left: 0,
      top: 0,
      backgroundColor: isSelectedBoardIndex
        ? ""
        : isSelected
        ? "rgba(245, 40, 145, 0.3)"
        : "",
    },
  })
);

const SudokuSquare: React.FC<SudokuSquareProps> = ({
  selectedIndex,
  selectedRowIndex,
  selectedBoardIndex,
  rowIndex,
  boardIndex,
  index,
  value,
  initialValue,
  setSelectedBoardIndices,
  answer,
  hide,
  notes,
  hasError,
}) => {
  const isHighlighted = () => {
    return selectedIndex === index || rowIndex === selectedRowIndex;
  };

  return (
    <OuterContainer
      isSelected={isHighlighted()}
      isLastColumn={index === 9}
      isLastRow={rowIndex === 9}
      isThickRight={index === 3 || index === 6}
      isThickBottom={rowIndex === 3 || rowIndex === 6}
      isSelectedBoardIndex={selectedBoardIndex === boardIndex}
      onClick={() => {
        setSelectedBoardIndices({
          selectedIndex: index,
          selectedRowIndex: rowIndex,
          selectedBoardIndex: boardIndex,
        });
      }}
    >
      {hide ? null : notes.length ? (
        <NotesWrapper values={notes} isOriginal={value.isOriginal} />
      ) : (
        <ValueWrapper
          answer={answer}
          hasError={hasError}
          isOriginal={value.isOriginal}
          isHighlighted={isHighlighted()}
          isSelectedBoardIndex={selectedBoardIndex === boardIndex}
          value={value.value || initialValue.value}
          smaller={notes.length > 0}
        />
      )}
    </OuterContainer>
  );
};

SudokuSquare.displayName = "SudokuSquare";

export const Main = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => `white`};

  width: 460px;
  overflow: hidden;
  color: ${({ theme }) => `black`};
`;

export const Board = styled.div`
  display: flex;
  border-color: ${({ theme }) => `black`};
  border-radius: 3px;
`;

export interface SudokuProps {
  difficulty: Difficulty;
  onComplete: () => void;
  hide: boolean;
}

export const Sudoku: React.FC<SudokuProps> = ({
  hide,
  difficulty = "easy",
}) => {
  const [values, setValues] = React.useState<Value[]>([]);
  const [selectedBoardIndex, setSelectedBoardIndex] = React.useState<
    number | null
  >(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(
    null
  );
  const [board, setBoard] = React.useState<Value[][]>([]);

  React.useEffect(() => {
    const { values, board } = getBoard(difficulty);
    setValues(values);
    setBoard(board);
  }, []);

  const getBoardIndex = (rowIndex: number, index: number) =>
    rowIndex * 9 + index;

  const getValue = React.useCallback((boardIndex: number) => {
    const valueForIndex = values[boardIndex];
    return valueForIndex;
  }, []);

  const setValue = (boardIndex: number, value: Value) => {
    const newValues = [...values];
    newValues[boardIndex] = value;
    console.log("newValues", newValues);
    setValues(newValues);
  };

  const setSelectedBoardIndices = ({
    selectedIndex,
    selectedRowIndex,
    selectedBoardIndex,
  }: {
    selectedIndex: number;
    selectedRowIndex: number;
    selectedBoardIndex: number;
  }) => {
    setSelectedIndex(selectedIndex);
    setSelectedRowIndex(selectedRowIndex);
    setSelectedBoardIndex(selectedBoardIndex);
    console.log(selectedIndex, selectedRowIndex, selectedBoardIndex);
  };

  const buildRow = (rowIndex: number) => (value: Value, index: number) => {
    const boardIndex = getBoardIndex(rowIndex, index);
    const val = values[boardIndex];

    return (
      <SudokuSquare
        key={`${difficulty}-${rowIndex}-${index}`}
        value={val}
        hasError={values[boardIndex]?.hasError}
        initialValue={value}
        answer={value.answer}
        rowIndex={rowIndex}
        boardIndex={boardIndex}
        index={index}
        hide={hide}
        selectedIndex={selectedIndex}
        selectedRowIndex={selectedRowIndex}
        selectedBoardIndex={selectedBoardIndex}
        setSelectedBoardIndices={setSelectedBoardIndices}
        setValue={setValue}
        notes={[]}
      />
    );
  };

  const buildBoard = (rowValues: Value[], rowIndex: number) => (
    <Board key={rowIndex}>{rowValues.map(buildRow(rowIndex))}</Board>
  );

  const handleButtonPress = (value: ButtonValue) => {
    if (selectedBoardIndex === null) {
      return;
    }

    const selectedValue = values[selectedBoardIndex];
    if (selectedValue.isOriginal) {
      return;
    }

    if (typeof value === "number") {
      setValue(selectedBoardIndex, {
        ...selectedValue,
        value,
        hasError: selectedValue.hasError && selectedValue.answer !== value,
      });
    }
  };

  return (
    <div className="items-center justify-center inline-flex h-screen flex-col">
      <Main className="border-4 border-black">{board.map(buildBoard)}</Main>
      <ButtonBar onClick={handleButtonPress} />
    </div>
  );
};
