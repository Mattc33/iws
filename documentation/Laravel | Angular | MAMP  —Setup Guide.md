# Laravel | Angular | MAMP  —Setup Guide

[TOC]



## Setup

---

Source: https://telliott.io/node/969

---

### Step 1. PHP version check

---

> Make sure the PHP version installed on the command line is the same version installed on  MAMP.

Find out where your php executable is located

```Terminal
which php
```

By default the location should be...

``` Terminal
/usr/bin/php
```

Now swap over to the PHP version installed with MAMP, it should be located in

`/Applicatons/MAMP/bin/php/php7.2.8/bin` **(MAMP 4.0 as of 11/17/2017)**

To do this, edit the `.bash_profile` and add the MAMP version of PHP to the PATH variable, located...

```Terminal
~/.bash_profile
```

---

You can manually edit the file with any txt editor, 

<img src="https://i.gyazo.com/e1975989bc2b6edb1d9f0763a4089b8c.png" />

or

---

Use the terminal,

- ```Terminal
  vim ~/.bash_profile
  ```

- Type `i` paste the following

  ```Terminal
   export PATH=/Applications/MAMP/bin/php/php7.1.8/bin:$PATH
  ```

---

### Step 2. Configure Composer

---

Setup the PHP package manager. Change to any working directory, we will move the download later.

```terminal
curl -s  http://getcomposer.org/installer | php
```

This will create a composer.phar file which you can run from your working directory.

```terminal
php composer.phar
```

Move composer.phar to `/usr/local/bin/` 

```terminal
sudo mv composer.phar /usr/local/bin/
```

edit your `~/.bash_profile` to include

```terminal
alias composer="php /usr/local/bin/composer.phar"
```

once composer is set globally you can simply type

```terminal
composer
```

---

### Step 3. Install using Composer, Set up your environment

---

#### Laravel Only

```terminal
composer create-project laravel/laravel your-project-name --prefer-dist
```

#### Laravel-Angular | NPM - Grunt - Gulp

Make sure Node(4.0 or >) and npm is installed.

https://nodejs.org/en/

Check if **gulp** and **bower** is installed

```
gulp -v
bower -v
```

if not

```
npm install -g gulp 
npm install -g bower
```

##### Setup

change to a directory you want to setup the project

```
composer create-project jadjoubran/laravel5-angular-material-starter --prefer-dist
```

`cd` into the newly created directory. Install the local node dependencies and bower packages

```
npm install
bower install
```

edit your `.env` file and fix your DB credentials

create a new Angular project in the new directory

```
ng new your-project-name
```

create a new Laravel project in the new directory

```
composer create-project laravel/laravel your-project-name
```

---

To run angular live-local server: make sure to have node packages installed in project dir, else do a `npm install`

```
ng serve
```

To run a laravel live-local server

```
php artisan serve
```

or

```
php -S localhost:8000 -t public/
```

---

##### Potential Laravel live-server bugs

Make sure you turn on logs.

`root/config/app.php` look for:

```php
'debug' => env('APP_DEBUG', false),
```

Make this `true`

---

###### No Application encryption key has been applied

Your laravel project needs an application key

run in laravel dir

```
php artisan key:generate
```

if you run into this error

> [ErrorException]                                                                                                 file_get_contents(/Users/your-user/workspace/project-root/laravel-module/.env): failed to open stream: No such file or directory 

**rename .env.example to .env**

---

### Step 4. Configure Laravel Site in MAMP

---

Go to MAMP -> Prefernces -> Web Server -> Click on the folder icon next to `Document Root:`

-> Point to your larval project's public folder for example

```
../workspace/my-project/laravel-module/public
```

If you want to run your project in MAMP instead, launch the MAMP server and navigate to the local `localhost:8888` 

---

### Step 5. Configure your database

---

Go to your `.env` file in your root laravel project dir

edit the

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=homestead
DB_USERNAME=homestead
DB_PASSWORD=secret
```

and also in ../config/database.php; change the nessacary entries here

```php
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),//change db host, using local here
            'port' => env('DB_PORT', '8889'), //change the port
            'database' => env('DB_DATABASE', 'carriers'), //db name
            'username' => env('DB_USERNAME', 'root'), //default -u is root
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
        ],
```

---

## Resources

---

- https://laravel-angular.io/

