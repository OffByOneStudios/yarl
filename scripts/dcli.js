#!/usr/bin/env node

global.YARL_BROWSER = false;
global.YARL_ELECTRON = false;
global.YARL_NATIVE = false;
global.YARL_ENTRYPOINT = true;

require('./')
