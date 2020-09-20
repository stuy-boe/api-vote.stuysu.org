const nodemailer = require('nodemailer');
const { MAILER_URL } = require('../constants');
const nunjucks = require('nunjucks');
const path = require('path');
const { parse } = require('node-html-parser');
const templatesPath = path.resolve(__dirname, './../emailTemplates');

nunjucks.configure(templatesPath, { autoescape: true });

class Mailer {
	static transporter;

	static async getTransporter() {
		// This function can handle async logic for getting a transporter if needed

		if (!this.transporter) {
			if (MAILER_URL) {
				this.transporter = nodemailer.createTransport(MAILER_URL, {
					from: 'Stuy Voting Site <no-reply@vote.stuysu.org>'
				});
			} else {
				console.log(
					'This app is using test email credentials and will not be able to actually send emails'
				);

				const testAccount = await nodemailer.createTestAccount();

				// create reusable transporter object using the default SMTP transport
				this.transporter = nodemailer.createTransport({
					host: 'smtp.ethereal.email',
					port: 465,
					secure: true,
					auth: {
						user: testAccount.user,
						pass: testAccount.pass
					}
				});
			}
		}

		return this.transporter;
	}

	/**
	 * Renders an email template and sends it out
	 * @async
	 * @param {string} template - The filename of the email template (includes file extension)
	 *
	 * @param {Object} context - The variables to pass to the template renderer
	 *
	 *
	 * @param options - Information about the email being sent
	 * @param {string|string[]} options.to - The recipient(s) of the email
	 * @param {string|string[]} options.subject - The subject of the email
	 * @param {string|string[]} options.cc - CC recipient(s) of the email
	 * @param {string|string[]} options.bcc - BCC recipient(s) of the email
	 */
	static async sendEmailTemplate(template, context, options) {
		const transporter = await this.getTransporter();

		const { to, subject, cc, bcc } = options;
		const html = nunjucks.render(template, context);
		const text = parse(html).structuredText;

		transporter.sendMail({
			to,
			cc,
			bcc,
			subject,
			html,
			text
		});
	}
}

module.exports = Mailer;
