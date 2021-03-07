# ZooluFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Branching Strategy

```
[task-number] [commit description]
```

Ex. YS-10 Angular setup

## Deployments

### Staging

All the deployments are managed by gitlab CI. To deploy you just have to push your changes on branch `staging` 
and the tasks `build` then `deploy` will be triggered. 
Watch the pipelines status in gitlab ci/cd - pipelines

The result image tag will looks like `registry.gitlab.com/{group}/{project}:staging`

### Production

This repository oly build the image for production and add it into gitlab registry, the deploy is done using repository 
production cluster. For more information consult the about deploy consul readme file form production cluster repository

In order to build the image you have to push your code on branch production. The job build will 
generate an image with tag in following format:

`registry.gitlab.com/{group}/{project}:{commit_hash}`
