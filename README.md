# Description

Faceted search tool to display the data from InterMine database, allowing the users to search easily within the different mines available around InterMine
without the requirement of having an extensive knowledge of the data model.

## Demo / Preview

You can access the demo in [this link](https://intermine-data-browser.netlify.app/).

<p align="center">
  <img src="https://github.com/AdrianBZG/InterMine-Data-Browser-Tool/assets/8275330/ed04f673-4bd8-48d5-9e74-69400187cbd9"/>
</p>

## Quick Links

- Check out the [latest deployed version](https://intermine-data-browser.netlify.app/)
- Read the latest stable documentation [docs](https://intermine-data-browser.netlify.app/docs)
- Set up the project [to contribute](#contributing-guidelines)

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

