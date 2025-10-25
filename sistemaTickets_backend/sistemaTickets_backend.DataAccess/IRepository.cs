using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace sistemaTickets_backend.DataAccess
{
    interface IRepository<T>
    {
        public  Task <IEnumerable<T>> List();
        public Task <RequestStatus> Insert(T item);
        public Task <RequestStatus> Update(T item);
        public Task <IEnumerable<T>> Find(T? item);
        public Task <RequestStatus> Delete(T item);
    }
}
