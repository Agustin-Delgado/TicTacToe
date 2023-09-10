import { useState } from "react";
import styled from "styled-components";

const Grid = styled.div<{ $size: number }>`
    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.$size}, minmax(0, 1fr))`};
`;

const SIZE = 3;

const getFormattedMatrix = () => {
    const MATRIX_SIZE = new Array(SIZE * SIZE).fill(0);
    return Array.from({ length: SIZE }, () => MATRIX_SIZE.splice(0, SIZE));
};

const formattedMatrix = getFormattedMatrix();

function App() {
    const [matrix, setMatrix] = useState(formattedMatrix);
    const [winner, setWinner] = useState<number | null | undefined>(null);
    const [end, setEnd] = useState(false);
    const [player, setPlayer] = useState(1);

    const handleChangePlayer = () => {
        if (player === 1) setPlayer(2);
        if (player === 2) setPlayer(1);
    };

    const handleCheckWinner = (matrix: number[][]) => {
        // check rows
        for (let rowIndex in matrix) {
            if (matrix[rowIndex].every((row) => row === player)) {
                setEnd(true);
                return setWinner(player);
            }
        }
        // check columns
        for (let rowIndex in matrix) {
            const fippedColumn = [];
            for (let columnIndex in matrix[rowIndex]) {
                fippedColumn.push(matrix[columnIndex][rowIndex]);
            }
            if (fippedColumn.every((row) => row === player)) {
                setEnd(true);
                return setWinner(player);
            }
        }
        // check crosses
        const firstCross = [];
        const secondCross = [];
        for (let rowIndex in matrix) {
            firstCross.push(matrix[rowIndex][rowIndex]);
            secondCross.push([...matrix].reverse()[rowIndex][rowIndex]);
        }
        if (firstCross.every((row) => row === player) || secondCross.every((row) => row === player)) {
            setEnd(true);
            return setWinner(player);
        }
        // check draw
        if (!matrix.flat().includes(0)) {
            setEnd(true);
            setWinner(undefined);
        }
    };

    const handleSelectCell = (x: number, y: number) => {
        if (end) return;
        if (matrix[x][y] !== 0) return;

        const newArray = matrix.map((xNew, xIndex) =>
            xNew.map((_, yIndex) => {
                if (xIndex === x && yIndex === y) return player;
                return matrix[xIndex][yIndex];
            })
        );
        setMatrix(newArray);
        handleChangePlayer();
        handleCheckWinner(newArray);
    };

    const handleReset = () => {
        setMatrix(formattedMatrix);
        setPlayer(1);
        setWinner(null);
        setEnd(false);
    };

    return (
        <div className="flex flex-col w-full items-center">
            <div className="p-10">
                <h1 className="text-4xl	font-bold">Tic Tac Toe</h1>
            </div>
            <Grid $size={SIZE}>
                {matrix.map((x, xIndex) =>
                    x.map((_, yIndex) => (
                        <div
                            className="flex justify-center items-center transition-all ease-in duration-200 w-20 h-20 ring-1 cursor-pointer hover:bg-gray-200"
                            key={yIndex}
                            onClick={() => handleSelectCell(xIndex, yIndex)}
                        >
                            {matrix[xIndex][yIndex] === 1 ? "X" : matrix[xIndex][yIndex] === 2 ? "O" : ""}
                        </div>
                    ))
                )}
            </Grid>
            {end && (
                <div className="text-4xl	font-bold m-10">
                    {winner && `Winner: player ${winner}`}
                    <div>
                        <button
                            onClick={handleReset}
                            className="rounded-md transition-all ease-in duration-200 bg-black px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Restart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
