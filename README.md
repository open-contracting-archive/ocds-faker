# OCDS Faker

A command line tool to generate fake data for OCDS release packages.

Example usage:

`node ocds-faker.js -i -p ../schemas/release-package-schema.json -r ../schemas/release-schema.json`

Options:
* `-i`: ignore `null` type in arrays of valid types
* `-p [/path/to/schema]`: Path to OCDS JSON release-package-schema
* `-r [/path/to/schema]`: Path to OCDS JSON release-schema


## Installation

Clone this repository and run

`npm install .`
