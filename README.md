# Legion Ecommerce App

Legion is a demo application of an ecommerce web application. It is strictly for demo purposes.

## Live Demo

You can try it out [here](https://jjad14-legion.xyz).

## Description

Users can sort and filter products either by using the left side bar or the search bar. 
Users must login to purchase items, filling out a form with their information.
After a successful order, users can view their completed order using the users dropdown on the navbar.

Admins can create, update or delete products.

## Built Using

### Frontend
##### Angular 9
##### Bootstrap 4

### Backend
##### Asp.net Core Web Api 3.1
##### MS SQL

## Deployment

Deployed via Digital Ocean LAMP Droplet

## Usage (via VSCode)


Clone Repository

### Frontend
In environment.ts

```
  apiUrl: 'https://localhost:5001/api/',
  stripeKey: ''
```

### Backend

In appsettings.json:

```
 "StripeSettings": {
    "PublishableKey": "pk_test_",
    "SecretKey": "sk_test_",
    "WhSecret": "whsec_"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost; Database=; Uid=; Pwd=",
    "IdentityConnection": "Server=localhost; Database=; Uid=; Pwd=",
    "Redis": "localhost"
  },
  "Token": {
    "Key": "",
    "Issuer": "https://localhost:5001"
  },
  "ApiUrl": "https://localhost:5001/Content/",
  "AllowedHosts": "*"
```

## Run

#### Frontend
```
npm install
ng serve
```

#### Backend
```
dotnet restore
dotnet watch run
```
