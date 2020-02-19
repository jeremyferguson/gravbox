import random,sys

step = 0

class Ball:
    moved = []
    to_move = []
    direction = 2
    balls = []
    
    def __init__(self,x,y):
        self.x = x
        self.y = y
        self.path = [coords(x,y)]
        Ball.balls.append(self)

    def attempt_move(self,stack,grid):
        target = get_target(self,grid)
        target_str = grid.cell_at(target)
        ball_check = Ball.ball_at(self,target)
        if target_str == '#' or self.at_border(grid):
            Ball.to_move.remove(self)
            grid.move_ball(self,coords(self.x,self.y))
        elif ball_check != -1:
            if ball_check not in Ball.to_move:
                Ball.to_move.remove(self)
                grid.move_ball(self,coords(self.x,self.y))
        else:
            #print('moved')
            Ball.to_move.remove(self)
            self.move(target,stack,grid)

    def move(self,target,stack,grid):
        try: 
            cell_str = grid.cell_at(target)
            grid.move_ball(self,target)
            Ball.moved.append(self)
            if cell_str.isalpha():
                push(stack,cell_str)
            elif cell_str.isdigit():
                push(stack,int(cell_str))
            elif cell_str == '+':
                push(stack,pop(stack)+pop(stack))
            elif cell_str == '-':
                push(stack,pop(stack)-pop(stack))
            elif cell_str == '*':
                push(stack,pop(stack)*pop(stack))
            elif cell_str == '|':
                push(stack,pop(stack)/pop(stack))
            elif cell_str == '!':
                push(stack,1/pop(stack))
            elif cell_str == '@':
                Ball.direction = 3 if Ball.direction == 0 else Ball.direction - 1
            elif cell_str == '/':
                self.direction = 1
                return
            elif cell_str == '\\':
                self.direction = 3
                return
            elif cell_str == '?':
                self.direction = random.choice([1,3])
                return
            elif cell_str == ',':
                if grid.run_by_flask:
                    raise InputReachedException
                val = input()
                if val.isdigit():
                    push(stack,int(val))
                else:
                    push(stack,val)
            elif cell_str == '.':
                val = pop(stack)
                if type(val) == int:
                    val = chr(val)
                if grid.run_by_flask:
                    if step in grid.output:
                        grid.output[step] += val
                    else:
                        grid.output[step] = val
                else:
                    print(val,end='')
            elif cell_str == '^':
                val = pop(stack)
                push(stack,val)
                push(stack,val)
            elif cell_str == '%':
                pop(stack)
            elif cell_str == '&':
                if get(stack) > 0:
                    self.direction = 1
                    return
                else:
                    self.direction = 3
                    return
            elif cell_str == '$':
                push(stack,length(stack))
            elif cell_str == '~':
                raise ProgramFinishedException()
            elif cell_str == ':':
                swap(stack)
            elif cell_str == ';':
                val = pop(stack)
                if type(val) == str:
                    val = ord(val[0])
                if grid.run_by_flask:
                    if step in grid.output:
                        grid.output[step] += str(val)
                    else:
                        grid.output[step] = str(val)
                else:
                    print(val,end='')
            self.direction = Ball.direction
        except TypeError as e:
            print(str(e))
            raise GravException('Invalid stack addition')
        except IndexError:
            raise GravException('Tried to pop from empty stack')

    def at_border(self,grid):
        if self.direction == 0: #UP
            return self.y == 0
        elif self.direction == 1: #RIGHT
            return self.x == grid.width - 1
        elif self.direction == 2: #DOWN
            return self.y == grid.height - 1
        elif self.direction == 3: #LEFT
            return self.x == 0
        else:
            raise GravException('Invalid direction. Gravity appears to be broken.')

    def ball_at(self,target):
        for ball in Ball.balls:
            if ball.x == x(target) and ball.y == y(target):
                return ball
        return -1

    def __repr__(self):
        return "Ball({0}, {1})".format(self.x,self.y)

class Grid:
    def __init__(self,code,run_by_flask=False):
        self.cells = []
        code = code.split('\n')
        i = 0
        self.height = len(code)
        self.run_by_flask = run_by_flask
        self.output = {}
        while i < self.height:
            self.cells.append([])
            j = 0
            line = code[i]
            line_len = len(line)
            while j < line_len:
                ch = line[j]
                self.cells[i].append(ch)
                if ch == "'":
                    self.cells[i][j] = ' '
                    Ball(j,i)
                j += 1
            i += 1
        self.width = len(max(self.cells,key = lambda x: len(x)))
        if not Ball.balls:
            raise GravException('No balls provided in program')
        for line in self.cells:
            line += [" "] * (self.width - len(line))
    
    def cell_at(self,coords):
        return self.cells[y(coords)][x(coords)]

    def move_ball(self,ball,coords):
        ball.x,ball.y = x(coords),y(coords)
        ball.path.append([ball.x,ball.y])

    def copy_cells(self):
        new_cells = []
        for line in self.cells:
            new_cells.append(line[:])
        return new_cells

    def __repr__(self):
        return "{0}x{1} Grid".format(self.height,self.width)

    def __str__(self):
        output = self.copy_cells()
        if not self.run_by_flask:
            for ball in Ball.balls:
                output[ball.y][ball.x] = "'"
        return "\n".join(["".join([char[-1:] for char in line]) for line in output])

def get_target(ball,grid):
    if ball.direction == 0:
        return coords(ball.x,max(0,ball.y-1))
    elif ball.direction == 1:
        return coords(min(grid.width-1,ball.x+1),ball.y)
    elif ball.direction == 2:
        return coords(ball.x,min(grid.height-1,ball.y+1))
    elif ball.direction == 3:
        return coords(max(0,ball.x-1),ball.y)

def execute_loop(grid,stack):
    height,width = grid.height,grid.width
    Ball.to_move = order_balls(Ball.balls,Ball.direction)
    Ball.moved = []
    def execute_helper(grid,stack):
        i = 0
        while i < len(Ball.to_move):
            curr_ball = Ball.to_move[i]
            curr_ball.attempt_move(stack,grid)
            if curr_ball in Ball.to_move:
                i += 1

        if not Ball.moved:
            raise ProgramFinishedException()
        if Ball.to_move:
            execute_helper(grid,stack)
    execute_helper(grid,stack)

def order_balls(balls,direction):
    if direction == 0: 
        reverse = False
        pair_order = lambda x,y: (y,x)
    elif direction == 1:
        reverse = True
        pair_order = lambda x,y: (x,y)
    elif direction == 2:
        reverse = True
        pair_order = lambda x,y: (y,x)
    elif direction == 3:
        reverse = False
        pair_order = lambda x,y: (x,y)
    else:
        raise GravException('Invalid direction. Gravity appears to be broken.')
    max_sec_dim = max(balls,key = lambda ball: pair_order(ball.x,ball.y)[1])
    return sorted(balls, key = lambda ball: pair_order(ball.x,ball.y),reverse=reverse)

def run_program(code,verbose = False,interval=0,st=None,run_by_flask = False,balls = None,direction = 2,start_step = 0):
    try:
        Ball.balls = []
        if balls:
            for ball in balls:
                Ball(ball[0],ball[1])
        Ball.direction = direction
        grid = Grid(code,run_by_flask)
        if not st:
            st = stack()
        global step
        step = start_step
        while True:
            execute_loop(grid,st)
            if verbose:
                print(grid)
                print(st)
            if interval:
                if step % interval == 0:
                    print(grid)
            step += 1
    except InputReachedException:
        return {'paths':[ball.path for ball in Ball.balls],'stack':st,'status':0,'state':str(grid),'output':grid.output,'direction':Ball.direction,'steps':step+1}
    except ProgramFinishedException:
        if not run_by_flask:
            print('\nProgram finished.')
            return str(grid)
        return {'paths':[ball.path for ball in Ball.balls],'stack':st,'status':1,'state':str(grid),'output':grid.output,'direction':Ball.direction,'steps':step}
    except GravException as e:
        if not run_by_flask:
            print("Error: "+str(e))
            print("Program state at time of error:")
            print(grid)
        else:
            try:
                state = str(grid)
                output = grid.output
            except NameError:
                state = code
                output = ''
            return {'paths':[ball.path for ball in Ball.balls],'stack':st,'status':2,'state':state,'error':str(e),'output':output,'direction':Ball.direction,'steps':step}

def stack():
    return [0]

def pop(stack):
    assert type(stack) == list
    return stack.pop(0)

def push(stack,element):
    assert type(stack) == list
    stack.insert(0,element)

def length(stack):
    assert type(stack) == list
    return len(stack)

def swap(stack):
    stack[0],stack[-1] = stack[-1],stack[0]

def get(stack):
    return stack[0]

def coords(x,y):
    return x,y

def x(coords):
    return coords[0]

def y(coords):
    return coords[1]

class ProgramFinishedException(Exception):
    pass

class GravException(Exception):
    pass

class InputReachedException(Exception):
    pass

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Runs Gravbox files')
    parser.add_argument('filename',help="File to be run")
    parser.add_argument('-v',help="Verbose, display program execution step by step",action='store_true')
    parser.add_argument('-s',type=int,help="Interval of frames to return")
    args = parser.parse_args()
    if args.filename.find('.grv') == len(args.filename) - 4:
        try:
            with open(args.filename) as program_file:
                code = program_file.read()
                result = run_program(code,args.v,args.s)
        except FileNotFoundError:
            print('Error: filename not found')
    else:
        print('This program can only run files with a .grv extension')
