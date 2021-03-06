import React from 'react'
import axios, { post } from 'axios';
import { Form, Input, Button, Header } from 'semantic-ui-react'
class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            formId: props.formId
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    onFormSubmit(e) {

        e.preventDefault() // Stop form submit
        this.props.setUploadingStatus(true)
        this.fileUpload(this.state.file1, this.state.file2).then((response) => {

            this.props.setOutput(response.data);
            console.log(response.data);
            // this.props.setUploadingStatus(false)
        })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.files[0] })
    }

    fileUpload(file1, file2) {
        const url = 'https://taru.iam.upr.si:7082/file-upload';
        // const url = 'http://ec2-52-204-51-163.compute-1.amazonaws.com:4000/file-upload'
        const formData = new FormData();
        formData.append('file1', file1)
        formData.append('file2', file2)
        console.log('form id ' + this.state.formId)
        formData.append('formId', this.state.formId)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return post(url, formData, config)
    }

    render() {
        return (
            <Form onSubmit={this.onFormSubmit} style={{ padding: '10px' }}>
                <Header as="h2"> Upload the Files </Header>
                <Input type="file" name="file1" onChange={this.onChange} />
                <Input style={{ marginLeft: '10px'}} type="file" name="file2" onChange={this.onChange} />
                <Button style={{ marginLeft: '10px'}} color='teal' type="submit">Upload</Button>
            </Form>
        )
    }
}



export default FileUploader