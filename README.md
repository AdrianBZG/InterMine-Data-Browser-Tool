# Intermine Data Browser

The goal of this project is to implement a faceted search tool to display the data from InterMine
database, allowing the users to search easily within the different mines available around InterMine
without the requirement of having an extensive knowledge of the data model.

For the project organization, please refer to [InterMine](https://github.com/intermine)

## Quick Links

- Check out the [latest deployed version]()
- Learn more and get started with the [docs]()
- Set up the project [to contribute]()

## Required Ontology Concepts (per mine) for each filter

| Filter               | Ontology Concepts                                                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GO Annotation        | goAnnotation.ontologyTerm.name                                                                                                                                                   |
| Dataset Name         | dataSets.name                                                                                                                                                                    |
| Pathway Name         | pathways.name                                                                                                                                                                    |
| Organism short name  | Gene.organism.shortName                                                                                                                                                          |
| Location             | locations.start + locations.end + locations.locatedOn.primaryIdentifier                                                                                                          |
| Diseases (OMIM)      | diseases.name                                                                                                                                                                    |
| ClinVar              | alleles.clinicalSignificance + alleles.type                                                                                                                                      |
| Protein Localisation | proteinAtlasExpression.cellType + proteinAtlasExpression.tissue.name + proteinAtlasExpression.expressionType + proteinAtlasExpression.level + proteinAtlasExpression.reliability |
| Protein Domain Name  | proteins.proteinDomainRegions.proteinDomain.name                                                                                                                                 |
| Interactions         | interactions.participant2.symbol + interactions.details.type + interactions.details.dataSets.name                                                                                |
| Expression           | atlasExpression.pValue + atlasExpression.tStatistic + atlasExpression.expression + atlasExpression.dataSets.name                                                                 |

## Contributing Guidelines

These instructions, as well as more complete documentation can be found at [http://netlify-site]()

1. Find a thing to fix/implement in [Issues](https://github.com/JM_Mendez/InterMine-Data-Browser-Tool/issues?direction=desc&sort=created&state=open) or come up with your own idea, [create a discussion issue](https://github.com/JM_Mendez/InterMine-Data-Browser-Tool/issues/new) for it and get a feedback.

2. [Fork](https://help.github.com/articles/fork-a-repo) the repository.

3. Create your new feature branch.

```bash
   git checkout -b my-new-feature
```

4. Install the packages.

This project uses `yarn berry` for package management. Make sure to have it globally installed before proceeding.

```bash
npm install -g yarn
```

If you run `yarn -v`, the version displayed will be `v1*`. Yet, this project will automatically use `v2 berry`.

5. Commit your changes.

```bash
git commit -am 'Add some feature
```

6. Push to the newly created feature branch.

```bash
git push origin my-new-feature
```

7. Create a new [Pull Request](https://help.github.com/articles/using-pull-requests)
