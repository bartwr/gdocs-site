Ik gebruik momenteel node version 14.15.4.

Ik clone de repo naar een nieuwe map:

```
git clone git@github.com:bartwr/gdocs-site.git gdocs-site-20220320
cd gdocs-site-20220320/
```

Ik maak een bestand aan voor de environment variabelen:

```
touch .envrc
vi .envrc
```

Ik plak de volgende contents in .envrc:

```
(ask Bart or Naomi)
```

Ik sla .envrc op ( <escape> -> `:wq` -> <enter> )

Ik zorg dat .envrc geladen wordt op mijn Linux-PC:

```
direnv allow
```

Ik installeer dependencies:

```
yarn install
```

Ik installeer Meteor dependencies:

```
meteor npm install
```

Ik start de app:

```
yarn start
```

ERROR. Solution is below.


https://unix.stackexchange.com/a/38691
Hiermee zie je welke broken symlinks er zijn:

```
find . -xtype l
```

I delete the broken symlinks:

```
rm -R node_modules/create-hash
rm -R node_modules/create-hmac
rm -R ./node_modules/normalize-package-data
rm -R ./node_modules/rechoir
rm -R ./node_modules/liftoff
rm -R ./node_modules/diffie-hellman
rm -R ./node_modules/matchdep
rm -R ./node_modules/pbkdf2
```

```
yarn start
```

Now the app works and is running at http://localhost:3000 . Enjoy!