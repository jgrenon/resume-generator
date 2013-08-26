# Resume Generator

This project came from my frustration in constantly rebuilding and customizing my resume for specific jobs. As my career evolved and my experiences grew in various fields, I am stuck with a large resume with experience ranging from executives to software developers. I've been project manager, consultant in architecture, business analyts, scrum master, java developer, javascript developer, in permanent and contractual jobs, with a large number of projects and achievements. While I'm happy with my career, how can I sanely build a resume for a specific job, without dilluting my skills with irrelevant positions? 

Add to this that I live in Montreal where French and English coexists, so I need two sets of resumes, for a total of around 8 different resumes. So I need a tool to automatically build the right resume for me from a pool of positions, education, experiences and achievements. 

## Getting Started

You need to have NodeJS running on your machine. I decided to use this platform because this is what I've used for all my projects for the past 2 years. It provides a complete toolset to build such application and have an easy package manager for you to quickly setup this tool on your machine. 

Once you hace NodeJS 0.10.5+ installed, just type the following command from a terminal window : 

	sudo npm install -g resume-generator
	
You may not have to use *sudo* in your environment, but if you don't use it and get installation errors, just remove what you installed and reinstall with sudo. 

	npm uninstall -g resume-generator

You need to make sure that the shared npm/bin folder is in your path. This should be the case, but if not, there are plenty of documentation out there to help you with that. In a terminal window, you should be able to execute the generator and get the following results : 

	rg --help
	
	Resume Generator Version 0.1.0
	(C) Copyright 2013 Joel Grenon. Published under the Apache V2 License

	Match facts about your career and a job description to produce a customized resume. %0
	
	Options:
	  -b, --bio     Root file to your career facts                                        [default: "stdin"]
	  -j, --job     Path to a file describing the current job on which you want to apply  [default: "./job.yml"]
	  -f, --format  Format of the output. PDF, JSON, XML, MSWORD are supported            [default: "MSWORD"]
	  -o, --output  Output path for the produced resume.                                  [default: "stdout"]
	  -l, --layout  Template file to use to render your resume                            [default: "classic"]
	  -r, --rules   Additional folder where to load job analysis rules
	  -h, --help    Show this help
	  -s, --silent  Do not display any output to the console

## Describing your career

For the generator to work, you need to input a number of facts about your career. These facts are simply captured in a number of Yaml files in a folder on your computer. If you need help with the Yaml syntax, please see [this documentation](http://en.wikipedia.org/wiki/YAML)

### bio.yml

This is the foundation of your identity.

	me:
  		firstName: Joel
  		lastName: Grenon
  		birthday: YYY-MM-DD
  		sex: male|female
		native_language: @[en:french,fr:français]
		spoken_languages:
			- @[en:french,fr:français]
			- @[en:english,fr:anglais]
		written_languages:
			- @[en:french,fr:français]
			- @[en:english,fr:anglais]
	  address:
	    street: 123 Abc Avenue
	    city: Montreal
	    province: Quebec
	    country: Canada
	    postalCode: H2V 8U9
	  phones:
	    home: 438-555-9089
	    mobile: 514-555-0099
	  emails:
	    perso: joelgrenon@gmail.com
	    work: dummy@work.com
	    work2: dummy@work2.com

These data will be loaded by the generator and used by the layout you've chosen to build the resume heading. The special strings used for language labels is part of our localization framework (decribe below). The generator will parse these strings and render the most relevant language in your resume. This is a simple syntax that prevent the maintenance of multiple files for each languages. 


### education.yml

I this file, you list all your education entries, in whatever order you like. They won't be displayed in this order but will be sorted by the selected layout. Some layout will use a chronological order while order may choose a reverse chronological. 



