### update modules

```shell
ncu --u
npm i
npm ci
```

---

### fix `package-lock.json`

```shell
rm package-lock.json
rm -rf node_modules
npm install
npm run build
```

---

### install prettier

```shell
npm install -D prettier prettier-plugin-astro
```

---

### reformat everything

```shell
npx prettier --write .
```
