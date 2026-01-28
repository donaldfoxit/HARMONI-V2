import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 FULL ERROR INFO:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#fee',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#000'
        }}>
          <h1 style={{color: '#d00', marginBottom: '20px'}}>
            🔴 App Crashed
          </h1>
          <div style={{
            background: '#fff',
            border: '2px solid #d00',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <p><strong>Error:</strong> {this.state.error?.toString()}</p>
            {this.state.errorInfo && (
              <>
                <p><strong>Component Stack:</strong></p>
                <p>{this.state.errorInfo.componentStack}</p>
              </>
            )}
          </div>
          <button
            onClick={() => {
              console.log('Reloading page...');
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
