### update modules

```shell
ncu --u
npm i
npm ci
```

---

### 1. remove `package-lock.json`

```shell
rm package-lock.json
rm -rf node_modules
```

### 2. create `package-lock.json`

```shell
npm i
```

### 3. build

```shell
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
