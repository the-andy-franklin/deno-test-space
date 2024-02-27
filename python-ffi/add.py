# add.py
import sys
import json

def add(x, y):
    return x + y

if __name__ == "__main__":
    obj = json.loads(sys.argv[1])
    result = add(int(obj['a']), int(obj['b']))
    print(result)
