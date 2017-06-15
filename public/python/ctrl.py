import sys
import os

programName = 'VBA'
windowID = 'unfilled'

if (windowID == 'unfilled'):
  windowID = os.popen('xdotool search --onlyvisible --name ' + programName).read()
  windowID = windowID.strip()

  os.system('xdotool windowfocus ' + windowID + ' key --delay 100 ' + sys.argv[1])
