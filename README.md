# Taiga Front #

![Kaleidos Project](http://kaleidos.net/static/img/badge.png "Kaleidos Project")
[![Managed with Taiga.io](https://taiga.io/media/support/attachments/article-22/banner-gh.png)](https://taiga.io "Managed with Taiga.io")

This repo is a compiled versión of https://github.com/taigaio/taiga-front

## Installation ##

* Clone the repo
* Expose the `dist` directory under a static file web server
* Rename dist/js/conf.example.json to conf.json if you want to change settings

More information about the different installation methods (production, development, vagrant, docker...) can be found here http://taigaio.github.io/taiga-doc/dist/#_installation_guide.


## For Devs ##

To regenerate branches ```master``` and ```stable```

```
git checkout master; node dist.js master
git checkout stable; node dist.js stable
```

## Community ##

[Taiga has a mailing list](http://groups.google.com/d/forum/taigaio). Feel free to join it and ask any questions you may have.

To subscribe for announcements of releases, important changes and so on, please follow [@taigaio](https://twitter.com/taigaio) on Twitter.
