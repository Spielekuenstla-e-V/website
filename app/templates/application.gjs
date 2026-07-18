import { pageTitle } from 'ember-page-title';
import SiteHeader from 'spielekuenstla-website/components/site-header';
import SiteFooter from 'spielekuenstla-website/components/site-footer';
import '../styles/application.css';

<template>
  {{pageTitle "Spielekünstla"}}

  <div class="site-wrapper">
    <SiteHeader />

    {{outlet}}

    <SiteFooter />
  </div>
</template>
