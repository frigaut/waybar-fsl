# waybar-fsl
Display FreeStyle Libre BG value in waybar

I have implemented a display of the current BG from Freestyle Libre in waybar. This was triggered by finding out that there is a [open source library](https://github.com/DiaKEM/libre-link-up-api-client) to get the BG from the LibreView APIs.

> [!tldr]
> - A typescript fetcher gets the BG, trend, date from the Libreview APIs
> - A script massage these data and computes the data age
> - bg, trend and age are displayed in waybar, with color for warning, critical and out-of-date states

## Software components

### 1. Fetcher
In `/home/frigaut/packages/libre-link-up-api-client/src`. Run: 
```bash
ts-node fetch_bg.ts
{ "text":"8.1 →", "class":"warning", "date":1722634070}
{ "text":"7.9 →", "class":"good", "date":1722634130}
{ "text":"7.9 →", "class":"good", "date":1722634130}
```
Note: ts-node installed with `sudo npm install -g ts-node`
To date, this is not started automatically. It may also fail when using VPN, or with the network temporarily disconnecting.
`fetch_bg.ts` is a typescript program (because it is using a typescript library). It runs at regular interval (the Libreview seems to update every 60 seconds, so right now I am running that every 30 seconds to not accumulate delay). It will output the above json in `/tmp/bg.txt`.

### 2. Update script
in `~/bin/mybg`. This reads out `/tmp/bg.txt`, compute the time since the last data, and update the json to save this delay and update the state (warning, critical) with "ood" (out of date) if the data are too old (currently 300 seconds). It outputs the content of `/tmp/bg.txt` with the updated values to stdout (to be input by waybar).

### 3. Waybar components
In waybar config:
```json
"custom/bg": {
    "return-type": "json",
    "format": "   {}",
    "exec": "/home/frigaut/bin/mybg",
    "restart-interval": 5
},
```
In style.css:
```css
#custom-bg.critical {
    color: @critical;
}
#custom-bg.warning {
    color: @warning;
}
#custom-bg.ood {
    color: #808080;
}
#custom-bg {
    font-size: 120%;
}
```

## TODO

- [ ] Ensure fetch_bg.ts is running all the time, over network interuption, VPN switch, etc
