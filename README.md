# Duolingo unfollower v2

## Why?

I have made this because I was following/followed by random people on duolingo,
the wierd thing is I have never followed this many people, they just appeared randomly,
if you have the same problem I hope this will help you :)

## Usage

### Prerequesites

- node-18.7.0+ (has to have fetch)
- yarn/npm

Copy the `example-config.json` to `config.json` and configure it

- token - token in the request headers without Bearer (ex. eqixniuwvvd.diqdFIEDIEF3uwe9Q)
- urlDate - date in the URL (ex. 2022-03-24)
- userId - your userId (ex. 39791227)
You can find this information in devtools under the network panel, you have to be logged in for this. Just interact a bit with the site, then search for a fitting request in Devtools.

Then run

```shell
yarn
yarn start
```

and you should get rid of those followers/followed people!
