import { pageTitle } from 'ember-page-title';
import StaticPage from 'spielekuenstla-website/components/static-page';
import '../styles/legal.css';

<template>
  {{pageTitle @model.title}}

  <StaticPage @page={{@model}} />
</template>
