#    This script is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this script.  If not, see <http://www.gnu.org/licenses/>.

#R script for network analysis of protein models
#load lib
library(igraph)
library(bio3d)
rm(list=ls())
#read PDB file
pdb <- read.pdb("/home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/uploads/uploaded.pdb")
inds <- atom.select(pdb, 'protein',rm.h=TRUE) 
pdb <- trim.pdb(pdb, inds)
write.pdb(pdb, file="SAVE_FILE1_noH.pdb")
pdb <- read.pdb("SAVE_FILE1_noH.pdb")
inds <- atom.select(pdb, 'protein',rm.h=TRUE) 
my.atoms<-pdb$atom[inds$atom,]
#
N<-length(unique(pdb$atom$resno))
adj <- matrix(nrow = N, ncol = N,0) # adj matrix
g<-graph_from_adjacency_matrix(adj)
V(g)$name<-unique(my.atoms[,7])
rm(adj)
#
#my.atoms<-pdb$atom[inds$atom,c("x", "y", "z")] # CA atom coordinates
numatoms<-dim(my.atoms)[1]
#adj matrix
adj <- matrix(nrow = numatoms, ncol = numatoms,0) # adj matrix
#set threshold's
threshold<-4.0 #Upper threshold=4.0
# Create adj matrix - only upper triangle (no diagonal elements)
adj <- matrix(0,nrow = numatoms, ncol = numatoms)
DD<-dist(my.atoms[,9:11])#column 9,10,11 is xyz
adj[lower.tri(adj, diag=FALSE)] <- DD #write distances to adj 
adj<-adj+t(adj) # add upper triangle, is symmetric
#set values to zero or one if below threshold
adj[adj>threshold]<-0 #above threshold=0
adj[adj>1.0E-5]<-1 #else=1

ru<-unique(pdb$atom$resno)
for (j in 1:length(ru)){
  k<-which(pdb$atom$resno==ru[j])
  cn<-numeric()
  for (i in 1:length(k)){
      n<-which(adj[k[i],]==1)
      cn<-c(cn,n)
      }
  cn<-unique(cn)
  cd<-setdiff(cn,k)
  M<-which(V(g)$name %in% unique(pdb$atom[cd,7]))
  for (t in 1:length(M)){g<-g+edge(c(j,M[t]))}    
  rm(k)
  }
g1<-as.undirected(g)
pdb1<-pdb
cat(mean(degree(g1)),'\n')
rm(list= ls()[!(ls() %in% c('g1','pdb1'))])


############################
pdb <- read.pdb("/home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/uploads/uploaded2.pdb")
inds <- atom.select(pdb, 'protein',rm.h=TRUE) 
pdb <- trim.pdb(pdb, inds)
write.pdb(pdb, file="SAVE_FILE2_noH.pdb")
pdb <- read.pdb("SAVE_FILE2_noH.pdb")
inds <- atom.select(pdb, 'protein',rm.h=TRUE) 
my.atoms<-pdb$atom[inds$atom,]
#
N<-length(unique(pdb$atom$resno))
adj <- matrix(nrow = N, ncol = N,0) # adj matrix
g<-graph_from_adjacency_matrix(adj)
V(g)$name<-unique(my.atoms[,7])
rm(adj)
#
#my.atoms<-pdb$atom[inds$atom,c("x", "y", "z")] # CA atom coordinates
numatoms<-dim(my.atoms)[1]
#adj matrix
adj <- matrix(nrow = numatoms, ncol = numatoms,0) # adj matrix
#set threshold's
threshold<-4.0 #Upper threshold=4.0
# Create adj matrix - only upper triangle (no diagonal elements)
adj <- matrix(0,nrow = numatoms, ncol = numatoms)
DD<-dist(my.atoms[,9:11])#column 9,10,11 is xyz
adj[lower.tri(adj, diag=FALSE)] <- DD #write distances to adj 
adj<-adj+t(adj) # add upper triangle, is symmetric
#set values to zero or one if below threshold
adj[adj>threshold]<-0 #above threshold=0
adj[adj>1.0E-5]<-1 #else=1

ru<-unique(pdb$atom$resno)
for (j in 1:length(ru)){
  k<-which(pdb$atom$resno==ru[j])
  cn<-numeric()
  for (i in 1:length(k)){
      n<-which(adj[k[i],]==1)
      cn<-c(cn,n)
      }
  cn<-unique(cn)
  cd<-setdiff(cn,k)
  M<-which(V(g)$name %in% unique(pdb$atom[cd,7]))
  for (t in 1:length(M)){g<-g+edge(c(j,M[t]))}    
  rm(k)
  }
g2<-as.undirected(g)
pdb2<-pdb
cat(mean(degree(g2)),'\n')
rm(list= ls()[!(ls() %in% c('g1','pdb1','g2','pdb2'))])

#########################
#1
Gd<-difference(g1, g2)
#write "new" Bfactors(eigen values) in pdb
k<-which(degree(Gd)>=1)
kn<-as.numeric(names(k))
rm(k)
pdb1$atom$b<-0
for (i in 1:length(kn)) {
    k<-which(pdb1$atom$resno==kn[i])
    pdb1$atom$b[k]<-100
    rm(k)
    }
#write file
p.inds <- atom.select(pdb1, "protein")
protpdb <- trim.pdb(pdb1, p.inds)
write.pdb(protpdb, file="outputPDB/outputPDB1.pdb")

#2
Gd<-difference(g2, g1)
#write "new" Bfactors(eigen values) in pdb
k<-which(degree(Gd)>=1)
kn<-as.numeric(names(k))
rm(k)
pdb2$atom$b<-0
for (i in 1:length(kn)) {
    k<-which(pdb2$atom$resno==kn[i])
    pdb2$atom$b[k]<-100
    rm(k)
    }
#write file
p.inds <- atom.select(pdb2, "protein")
protpdb <- trim.pdb(pdb2, p.inds)
write.pdb(protpdb, file="outputPDB/outputPDB2.pdb")
