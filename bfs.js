import PathFinder from "./PathFinder.js";

class BreadthFirstSearch extends PathFinder {
    getSolutionPath (maze) {
        const startTime = performance.now() 
        let node = [1,0]
        const queue = [[node]]
        const visited = ['1;0']
        const path = []
        while (queue.length>0) {
            const currentPath = queue.shift()
            const headNode = currentPath[currentPath.length-1]
            path.push(headNode)
            const neighbours = this.getUnvisitedNeighbours(maze,headNode,visited)
            for (let neighbour of neighbours) {
                
                queue.push([...currentPath,neighbour])
                visited.push(`${neighbour[0]};${neighbour[1]}`)
                if (this.isGoal(maze,neighbour)) {
                    const solution = queue[queue.length-1]
                    return {
                        'solution': solution,
                        'path': path,
                        'totalNodesChecked': path.length,
                        'runtime': Math.round((performance.now() - startTime)*10000)/10000

                    }
                }
            }
        }
    }
}

export default BreadthFirstSearch