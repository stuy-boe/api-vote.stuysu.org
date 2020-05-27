require('express-async-errors');

const { expect } = require('chai');
const express = require('express');
const app = express();
const errorHandler = require('./../../middleware/errorHandler');
const request = require('supertest');
const RequestRefusalError = require('./../../utils/RequestRefusalError');
const sinon = require('sinon');

describe('errorHandler', () => {
	const spy = sinon.stub(console, 'error');

	const refusedError = new RequestRefusalError(
		'Request was refused.',
		'REQUEST_REFUSED'
	);

	const unexpectedError = new Error('Unexpected Error.');

	before(() => {
		/// We can use this to emulate waiting for an async process
		const sleep = () => {
			return new Promise(resolve => {
				setTimeout(resolve, 100);
			});
		};

		app.get('/throwRefusal', (req, res) => {
			throw refusedError;
		});

		app.get('/throwRefusalAsync', async (req, res) => {
			await sleep();
			throw refusedError;
		});

		app.get('/throwUnexpected', (req, res) => {
			throw unexpectedError;
		});

		app.get('/throwUnexpectedAsync', async (req, res) => {
			await sleep();
			throw unexpectedError;
		});

		app.use(errorHandler);
	});

	describe('Catching Request Refusal Errors', () => {
		const refusedRequestTest = endpoint => done => {
			request(app)
				.get(endpoint)
				.then(res => {
					expect(res.status).to.equal(403);

					expect(res.body.success).to.be.false;
					expect(res.body.error).to.have.property('code');
					expect(res.body.error).to.have.property('message');

					expect(res.body.error.code).to.equal('REQUEST_REFUSED');
					expect(res.body.error.message).to.equal(
						'Request was refused.'
					);

					done();
				});
		};

		it(
			'should catch synchronous Request Refusal Errors',
			refusedRequestTest('/throwRefusal')
		);

		it(
			'should catch asynchronous Request Refusal Errors',
			refusedRequestTest('/throwRefusalAsync')
		);
	});

	describe('Catching Unexpected Server Errors', () => {
		const unexpectedErrorTest = endpoint => done => {
			request(app)
				.get(endpoint)
				.then(res => {
					expect(spy.calledWith(unexpectedError)).to.be.true;

					expect(res.status).to.equal(500);

					expect(res.body.success).to.be.false;
					expect(res.body.error).to.have.property('code');
					expect(res.body.error).to.have.property('message');

					expect(res.body.error.code).to.equal('SERVER_ERROR');
					expect(res.body.error.message).to.equal(
						'There was an unexpected server error. We will review this shortly.'
					);

					done();
				});
		};

		it(
			'should catch synchronous unexpected errors',
			unexpectedErrorTest('/throwUnexpected')
		);

		it(
			'should catch asynchronous unexpected errors',
			unexpectedErrorTest('/throwUnexpectedAsync')
		);
	});

	after(() => {
		spy.restore();
	});
});
