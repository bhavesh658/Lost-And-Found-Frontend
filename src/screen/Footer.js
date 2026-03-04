import React from 'react'
import { Container } from 'react-bootstrap';
export default function () {
  return (
    <div>
        <footer className="bg-dark text-white py-4 mt-auto">
        <Container className="text-center">
          <p className="mb-0 text-white-50">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </p>
        </Container>
      </footer>


    </div>
  )
}
