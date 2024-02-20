pipeline {
    environment {
      branchname =  env.BRANCH_NAME.toLowerCase()
      kubeconfig = getKubeconf(env.branchname)
      registryCredential = 'jenkins_registry'
      namespace = "${env.branchname == 'development' ? 'conectaformacao-dev' : env.branchname == 'release' ? 'conectaformacao-hom' : env.branchname == 'release-r2' ? 'conectaformacao-hom2' : 'sme-conectaformacao' }"
    }

   agent { kubernetes { 
                  label 'builder'
                  defaultContainer 'builder'
                }
              } 

    options {
      buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
      disableConcurrentBuilds()
      skipDefaultCheckout()
    }

    stages {

        stage('CheckOut') {
            steps { checkout scm }
        }

        stage('Build') {
          when { anyOf { branch 'master'; branch 'main'; branch "story/*"; branch 'development'; branch 'release'; branch 'homolog';  } }
          steps {
            script {
              imagename1 = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/conectaformacao-frontend"
              dockerImage1 = docker.build(imagename1, "-f Dockerfile .")
              docker.withRegistry( 'https://registry.sme.prefeitura.sp.gov.br', registryCredential ) {
              dockerImage1.push()
              }
              sh "docker rmi $imagename1"
            }
          }
        }

        stage('Deploy'){
            when { anyOf {  branch 'master'; branch 'main'; branch 'development'; branch 'release'; branch 'homolog';  } }
            steps {
                script{
                    if ( env.branchname == 'main' ||  env.branchname == 'master' ) {
                        withCredentials([string(credentialsId: 'aprovadores-sgp', variable: 'aprovadores')]) {
                                timeout(time: 24, unit: "HOURS") {
                                    input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: "${aprovadores}"
                                }
                            }
                    }
                    withCredentials([file(credentialsId: "${kubeconfig}", variable: 'config')]){
                            sh('if [ -f '+"$home"+'/.kube/config ];then rm -f '+"$home"+'/.kube/config; fi')
                            sh('cp $config '+"$home"+'/.kube/config')
                            sh 'kubectl rollout restart deployment conectaformacao-frontend -n ${namespace}'
                            sh('rm -f '+"$home"+'/.kube/config')
                    }
                }
            }
        }
    }
  post {
    always { sh('if [ -f '+"$home"+'/.kube/config ];then rm -f '+"$home"+'/.kube/config; fi')}
  }
}

def getKubeconf(branchName) {
    if("main".equals(branchName)) { return "config_prd"; }
    else if ("master".equals(branchName)) { return "config_prd"; }
    else if ("homolog".equals(branchName)) { return "config_release"; }
    else if ("release".equals(branchName)) { return "config_release"; }
    else if ("development".equals(branchName)) { return "config_release"; }
}
