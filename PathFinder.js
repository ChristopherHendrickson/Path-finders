class PathFinder {

    getUnvisitedNeighbours (maze,node,visited) {
        const neighbours = []
        const directions = [[1,0],[0,1],[-1,0],[0,-1]] 
        for (let d of directions) {
            const newNode = [node[0]+d[0],node[1]+d[1]]
            if (maze.maze[newNode[0]][newNode[1]] == 0) {
                const nodeString = `${newNode[0]};${newNode[1]}`
                if (!visited.includes(nodeString)) {
                    neighbours.push(newNode)
                    
                }
            }
        }
        return neighbours
    }

    isGoal (maze,node) {
        return maze.goal[0] == node[0] && maze.goal[1] == node[1]
    }
}

export default PathFinder