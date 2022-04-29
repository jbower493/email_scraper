const fs = require('fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, './temp.txt'), { encoding: 'utf-8' })

const people = file
    .split('\r\n\r\n')
    .map(person => person.split('\r\n'))

const peopleDetails = people.map(person => {console.log(person)
    const details = {
        firstName: '',
        lastName: '',
        phone: '',
        mob: '',
        email: '',
        org: '',
        temp: '',

    }

    person.filter(line => line).forEach((line, lineIndex) => {
        // Assume first line is the name
        if (lineIndex === 0) {
            const fullName = line
                .toLowerCase()
                .replace(',', '')
                .split(' ')
                .filter(word => !['professor', 'doctor'].includes(word))

            const firstName = fullName[0]
            const lastName = fullName.length > 1 ? fullName[1] : ''

            details.firstName = firstName
            details.lastName = lastName
        }

        // Check for between 8 and 10 digits or spaces in the line
        if (/[\d\s]{10,20}/.test(line)) details.mob = line

        // Check for @, followed by x number of letters, followed by .
        if (/@/.test(line)) {
            const words = line.split(' ')
            const email = words.find(word => word.includes('@'))

            details.email = email
        }
    })

    return details
})

const sheet = [
    // Table headings
    ['Org', 'First', 'Last', 'Temp', 'Pos', 'Email', 'Phone', 'mob'],
    // Blank row for spacing
    []
];

peopleDetails.forEach(person => {
    const arr = [
        // Org
        '',
        // First name
        person.firstName,
        // Last name
        person.lastName,
        // Temp
        '',
        // Position
        '',
        // Email
        person.email,
        // Phone
        person.mob,
        // Mobile
        person.mob
    ]

    sheet.push(arr)
})

const writeable = sheet
    .map(line => line
        .map(word => word.trim())
        .join(',')
    )
    .join('\r\n')

fs.writeFileSync(path.join(__dirname, 'write.csv'), writeable)
