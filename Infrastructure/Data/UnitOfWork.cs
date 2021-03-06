using System;
using System.Collections;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // check if there's already a hash table created
            if (_repositories == null) {
                _repositories = new Hashtable();
            }

            // Get Entity name
            var type = typeof(TEntity).Name;

            // check to see if repositories hash table already contains a repository with this particular type
            if (! _repositories.ContainsKey(type)) {
                // create a repository type of generic repository 
                var repoType = typeof(GenericRepository<>);
                //  create an instance of this repository using the entity and pass in the context that we're going to get from our unit of work
                var repoInstance = Activator.CreateInstance(repoType.MakeGenericType(typeof(TEntity)), _context);

                // add repository to the hash table
                _repositories.Add(type, repoInstance);
            }

            // return the repository of type IGenericRepository
            return (IGenericRepository<TEntity>) _repositories[type];
        }
    }
}