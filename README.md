# Game of Life

This is a simple simulation of Conway's Game of Life implemented in HTML, CSS, and JavaScript. The simulation includes additional features such as terrain and lava cells.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Controls](#controls)
- [Customization](#customization)
- [License](#license)

## Features

- **Basic Game of Life**: Simulates Conway's Game of Life.
- **Terrain Cells**: Green cells that can influence the creation of life.
- **Lava Cells**: Red cells that can destroy life.
- **Speed Control**: Adjust the speed of the simulation.
- **Grid Toggle**: Grid lines are visible initially and disappear when the simulation starts.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/game-of-life.git
    ```
2. Navigate to the project directory:
    ```sh
    cd game-of-life
    ```

## Usage

1. Open `index.html` in your web browser to start the simulation.

## Controls

- **Start/Stop Simulation**: Click the "Start [S]" button to start the simulation. Click "Stop [S]" to stop it.
- **Go Back to First Generation**: Click the "Go back to first generation [R]" button to reset the simulation to the first generation.
- **Clear Board**: Click the "Clear board and start from first generation [C]" button to clear the board and start from the first generation.
- **Adjust Speed**: Use the speed slider to adjust the speed of the simulation.
- **Adjust Terrain Density**: Use the input field to set the density of terrain cells.
- **Adjust Lava Density**: Use the input field to set the density of lava cells.

## Customization

You can customize the simulation by modifying the following parameters in the `index.html` file:

- **Side Length of Board**: Adjust the number of cells along one side of the board.
- **Cell Width**: Adjust the width of each cell in pixels.
- **Speed**: Adjust the speed of the simulation in milliseconds.
- **Terrain Density**: Adjust the density of terrain cells.
- **Lava Density**: Adjust the density of lava cells.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
